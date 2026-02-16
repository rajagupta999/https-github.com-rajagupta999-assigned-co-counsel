/**
 * Cloud Storage Integration
 * 
 * Provides OAuth-based integration with:
 * - Google Drive
 * - Dropbox
 * 
 * Allows lawyers to connect their existing cloud storage
 * and sync documents directly into cases.
 */

export type CloudProvider = 'google_drive' | 'dropbox';

export interface CloudFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  modifiedTime: string;
  webViewLink?: string;
  downloadUrl?: string;
  path?: string;
  provider: CloudProvider;
}

export interface CloudFolder {
  id: string;
  name: string;
  path?: string;
  provider: CloudProvider;
}

export interface CloudAuthState {
  provider: CloudProvider;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  userEmail?: string;
}

// OAuth Configuration
const OAUTH_CONFIG = {
  google_drive: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    redirectUri: typeof window !== 'undefined' 
      ? `${window.location.origin}/api/auth/google/callback`
      : '',
  },
  dropbox: {
    clientId: process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID || '',
    authUrl: 'https://www.dropbox.com/oauth2/authorize',
    tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    redirectUri: typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth/dropbox/callback`
      : '',
  },
};

/**
 * Initiate OAuth flow for cloud provider
 */
export function initiateOAuth(provider: CloudProvider): void {
  const config = OAUTH_CONFIG[provider];

  if (!config.clientId) {
    console.error(`No client ID configured for ${provider}`);
    return;
  }

  // Generate state for CSRF protection
  const state = generateRandomString(32);
  sessionStorage.setItem(`oauth_state_${provider}`, state);

  let authUrl: string;

  if (provider === 'google_drive') {
    const googleConfig = OAUTH_CONFIG.google_drive;
    const params = new URLSearchParams({
      client_id: googleConfig.clientId,
      redirect_uri: googleConfig.redirectUri,
      response_type: 'code',
      scope: googleConfig.scopes.join(' '),
      access_type: 'offline',
      state,
      prompt: 'consent',
    });
    authUrl = `${googleConfig.authUrl}?${params.toString()}`;
  } else if (provider === 'dropbox') {
    const dropboxConfig = OAUTH_CONFIG.dropbox;
    const params = new URLSearchParams({
      client_id: dropboxConfig.clientId,
      redirect_uri: dropboxConfig.redirectUri,
      response_type: 'code',
      state,
      token_access_type: 'offline',
    });
    authUrl = `${dropboxConfig.authUrl}?${params.toString()}`;
  } else {
    return;
  }

  // Open OAuth popup
  const popup = window.open(
    authUrl,
    `${provider}_oauth`,
    'width=600,height=700,left=200,top=100'
  );

  // Listen for callback
  const checkClosed = setInterval(() => {
    if (popup?.closed) {
      clearInterval(checkClosed);
      // Check if auth was successful
      const authData = sessionStorage.getItem(`oauth_result_${provider}`);
      if (authData) {
        sessionStorage.removeItem(`oauth_result_${provider}`);
        window.dispatchEvent(new CustomEvent('cloud_auth_success', {
          detail: { provider, ...JSON.parse(authData) }
        }));
      }
    }
  }, 500);
}

/**
 * Handle OAuth callback (called from callback page)
 */
export async function handleOAuthCallback(
  provider: CloudProvider,
  code: string,
  state: string
): Promise<CloudAuthState> {
  // Verify state
  const savedState = sessionStorage.getItem(`oauth_state_${provider}`);
  if (state !== savedState) {
    throw new Error('Invalid OAuth state');
  }
  sessionStorage.removeItem(`oauth_state_${provider}`);

  const config = OAUTH_CONFIG[provider];

  // Exchange code for tokens
  const tokenResponse = await fetch('/api/auth/exchange-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider,
      code,
      redirectUri: config.redirectUri,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('Failed to exchange token');
  }

  const tokenData = await tokenResponse.json();

  const authState: CloudAuthState = {
    provider,
    isConnected: true,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresAt: Date.now() + (tokenData.expires_in * 1000),
    userEmail: tokenData.email,
  };

  // Store in session
  sessionStorage.setItem(`oauth_result_${provider}`, JSON.stringify(authState));

  return authState;
}

/**
 * List files from Google Drive
 */
export async function listGoogleDriveFiles(
  accessToken: string,
  folderId?: string
): Promise<CloudFile[]> {
  const query = folderId
    ? `'${folderId}' in parents and trashed = false`
    : `'root' in parents and trashed = false`;

  const params = new URLSearchParams({
    q: query,
    fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink)',
    pageSize: '100',
  });

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to list Google Drive files');
  }

  const data = await response.json();

  return data.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: parseInt(file.size) || 0,
    modifiedTime: file.modifiedTime,
    webViewLink: file.webViewLink,
    provider: 'google_drive' as CloudProvider,
  }));
}

/**
 * List folders from Google Drive
 */
export async function listGoogleDriveFolders(
  accessToken: string,
  parentId?: string
): Promise<CloudFolder[]> {
  const query = parentId
    ? `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    : `'root' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

  const params = new URLSearchParams({
    q: query,
    fields: 'files(id,name)',
    pageSize: '100',
  });

  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to list Google Drive folders');
  }

  const data = await response.json();

  return data.files.map((folder: any) => ({
    id: folder.id,
    name: folder.name,
    provider: 'google_drive' as CloudProvider,
  }));
}

/**
 * Download file from Google Drive
 */
export async function downloadGoogleDriveFile(
  accessToken: string,
  fileId: string
): Promise<Blob> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  return response.blob();
}

/**
 * List files from Dropbox
 */
export async function listDropboxFiles(
  accessToken: string,
  path: string = ''
): Promise<CloudFile[]> {
  const response = await fetch(
    'https://api.dropboxapi.com/2/files/list_folder',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path || '',
        recursive: false,
        include_media_info: false,
        include_deleted: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to list Dropbox files');
  }

  const data = await response.json();

  return data.entries
    .filter((entry: any) => entry['.tag'] === 'file')
    .map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: getMimeType(file.name),
      size: file.size,
      modifiedTime: file.server_modified,
      path: file.path_display,
      provider: 'dropbox' as CloudProvider,
    }));
}

/**
 * List folders from Dropbox
 */
export async function listDropboxFolders(
  accessToken: string,
  path: string = ''
): Promise<CloudFolder[]> {
  const response = await fetch(
    'https://api.dropboxapi.com/2/files/list_folder',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: path || '',
        recursive: false,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to list Dropbox folders');
  }

  const data = await response.json();

  return data.entries
    .filter((entry: any) => entry['.tag'] === 'folder')
    .map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      path: folder.path_display,
      provider: 'dropbox' as CloudProvider,
    }));
}

/**
 * Download file from Dropbox
 */
export async function downloadDropboxFile(
  accessToken: string,
  path: string
): Promise<Blob> {
  const response = await fetch(
    'https://content.dropboxapi.com/2/files/download',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Dropbox-API-Arg': JSON.stringify({ path }),
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  return response.blob();
}

/**
 * Universal file list function
 */
export async function listFiles(
  provider: CloudProvider,
  accessToken: string,
  folderId?: string
): Promise<CloudFile[]> {
  switch (provider) {
    case 'google_drive':
      return listGoogleDriveFiles(accessToken, folderId);
    case 'dropbox':
      return listDropboxFiles(accessToken, folderId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Universal folder list function
 */
export async function listFolders(
  provider: CloudProvider,
  accessToken: string,
  parentId?: string
): Promise<CloudFolder[]> {
  switch (provider) {
    case 'google_drive':
      return listGoogleDriveFolders(accessToken, parentId);
    case 'dropbox':
      return listDropboxFolders(accessToken, parentId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Universal download function
 */
export async function downloadFile(
  provider: CloudProvider,
  accessToken: string,
  fileId: string
): Promise<Blob> {
  switch (provider) {
    case 'google_drive':
      return downloadGoogleDriveFile(accessToken, fileId);
    case 'dropbox':
      return downloadDropboxFile(accessToken, fileId);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

/**
 * Import file to case
 */
export async function importFileToCase(
  provider: CloudProvider,
  accessToken: string,
  fileId: string,
  caseId: string,
  fileName: string
): Promise<string> {
  // Download file
  const blob = await downloadFile(provider, accessToken, fileId);
  
  // Extract text if possible
  const text = await extractTextFromBlob(blob, fileName);
  
  // Store in case documents and index for RAG
  // This would integrate with the document storage system
  
  return text;
}

/**
 * Extract text from file blob
 */
async function extractTextFromBlob(blob: Blob, fileName: string): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'txt') {
    return blob.text();
  }
  
  if (extension === 'pdf') {
    // In production, use PDF.js or server-side extraction
    // For now, return placeholder
    return '[PDF content - OCR required]';
  }
  
  if (['doc', 'docx'].includes(extension || '')) {
    // In production, use mammoth.js or server-side extraction
    return '[Word document - extraction required]';
  }
  
  return '';
}

/**
 * Get MIME type from filename
 */
function getMimeType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
  };
  
  return mimeTypes[extension || ''] || 'application/octet-stream';
}

/**
 * Generate random string for OAuth state
 */
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Check if auth is still valid
 */
export function isAuthValid(authState: CloudAuthState): boolean {
  if (!authState.isConnected || !authState.accessToken) {
    return false;
  }
  
  if (authState.expiresAt && Date.now() >= authState.expiresAt) {
    return false;
  }
  
  return true;
}

/**
 * Storage for auth states
 */
export function saveAuthState(authState: CloudAuthState): void {
  localStorage.setItem(`cloud_auth_${authState.provider}`, JSON.stringify(authState));
}

export function loadAuthState(provider: CloudProvider): CloudAuthState | null {
  const stored = localStorage.getItem(`cloud_auth_${provider}`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAuthState(provider: CloudProvider): void {
  localStorage.removeItem(`cloud_auth_${provider}`);
}
