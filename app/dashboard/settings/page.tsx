"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { changePassword, updateUserProfile } from '@/lib/auth';
import { 
  initiateOAuth, 
  loadAuthState, 
  clearAuthState, 
  isAuthValid, 
  CloudAuthState, 
  CloudProvider,
  listFiles,
  listFolders,
  CloudFile,
  CloudFolder,
} from '@/lib/cloudStorage';
import { getAvailableProviders, LLMProvider } from '@/lib/multiLLM';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'storage' | 'ai' | 'research' | 'profile'>('storage');
  
  // Cloud Storage
  const [googleAuth, setGoogleAuth] = useState<CloudAuthState | null>(null);
  const [dropboxAuth, setDropboxAuth] = useState<CloudAuthState | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [browserPath, setBrowserPath] = useState<string[]>([]);
  const [currentFiles, setCurrentFiles] = useState<CloudFile[]>([]);
  const [currentFolders, setCurrentFolders] = useState<CloudFolder[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  // AI Settings
  const [availableLLMs, setAvailableLLMs] = useState<LLMProvider[]>([]);
  const [preferredLLM, setPreferredLLM] = useState<LLMProvider>('cerebras');
  const [ragEnabled, setRagEnabled] = useState(true);
  const [citationMode, setCitationMode] = useState(false);

  // Research Settings
  const [westlawEmail, setWestlawEmail] = useState('');
  const [lexisEmail, setLexisEmail] = useState('');

  // Load saved auth states
  useEffect(() => {
    const google = loadAuthState('google_drive');
    const dropbox = loadAuthState('dropbox');
    
    if (google && isAuthValid(google)) {
      setGoogleAuth(google);
    }
    if (dropbox && isAuthValid(dropbox)) {
      setDropboxAuth(dropbox);
    }

    setAvailableLLMs(getAvailableProviders());
  }, []);

  // Listen for OAuth success
  useEffect(() => {
    const handleAuthSuccess = (event: CustomEvent) => {
      const { provider, ...authData } = event.detail;
      if (provider === 'google_drive') {
        setGoogleAuth(authData);
      } else if (provider === 'dropbox') {
        setDropboxAuth(authData);
      }
    };

    window.addEventListener('cloud_auth_success', handleAuthSuccess as EventListener);
    return () => window.removeEventListener('cloud_auth_success', handleAuthSuccess as EventListener);
  }, []);

  const handleConnect = (provider: CloudProvider) => {
    initiateOAuth(provider);
  };

  const handleDisconnect = (provider: CloudProvider) => {
    clearAuthState(provider);
    if (provider === 'google_drive') {
      setGoogleAuth(null);
    } else {
      setDropboxAuth(null);
    }
  };

  const handleBrowse = async (provider: CloudProvider) => {
    const auth = provider === 'google_drive' ? googleAuth : dropboxAuth;
    if (!auth?.accessToken) return;

    setSelectedProvider(provider);
    setIsLoadingFiles(true);
    setBrowserPath([]);

    try {
      const [files, folders] = await Promise.all([
        listFiles(provider, auth.accessToken),
        listFolders(provider, auth.accessToken),
      ]);
      setCurrentFiles(files);
      setCurrentFolders(folders);
    } catch (error) {
      console.error('Failed to list files:', error);
    }

    setIsLoadingFiles(false);
  };

  const handleNavigateFolder = async (folder: CloudFolder) => {
    const auth = selectedProvider === 'google_drive' ? googleAuth : dropboxAuth;
    if (!auth?.accessToken || !selectedProvider) return;

    setIsLoadingFiles(true);
    setBrowserPath([...browserPath, folder.name]);

    try {
      const folderId = selectedProvider === 'dropbox' ? folder.path : folder.id;
      const [files, folders] = await Promise.all([
        listFiles(selectedProvider, auth.accessToken, folderId),
        listFolders(selectedProvider, auth.accessToken, folderId),
      ]);
      setCurrentFiles(files);
      setCurrentFolders(folders);
    } catch (error) {
      console.error('Failed to navigate:', error);
    }

    setIsLoadingFiles(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Configure integrations and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'storage', label: 'Cloud Storage', icon: '☁️' },
          { id: 'ai', label: 'AI Models', icon: '🤖' },
          { id: 'research', label: 'Legal Research', icon: '📚' },
          { id: 'profile', label: 'Profile', icon: '👤' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-navy-800 border-navy-800'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cloud Storage Tab */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Connected Accounts</h3>
              <p className="text-sm text-slate-500 mt-1">
                Connect your cloud storage to import documents directly into cases
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Google Drive */}
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <svg width="28" height="28" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Google Drive</h4>
                    {googleAuth ? (
                      <p className="text-sm text-emerald-600">
                        ✓ Connected as {googleAuth.userEmail || 'User'}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">Not connected</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {googleAuth ? (
                    <>
                      <button
                        onClick={() => handleBrowse('google_drive')}
                        className="px-4 py-2 bg-navy-100 text-navy-800 rounded-lg text-sm font-semibold hover:bg-navy-200"
                      >
                        Browse Files
                      </button>
                      <button
                        onClick={() => handleDisconnect('google_drive')}
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect('google_drive')}
                      className="px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-semibold hover:bg-navy-800"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {/* Dropbox */}
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0061FF">
                      <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75-6 3.75-6-3.75zm18-3.75l6 3.75-6 3.75-6-3.75 6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75-6-3.75z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Dropbox</h4>
                    {dropboxAuth ? (
                      <p className="text-sm text-emerald-600">
                        ✓ Connected as {dropboxAuth.userEmail || 'User'}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">Not connected</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {dropboxAuth ? (
                    <>
                      <button
                        onClick={() => handleBrowse('dropbox')}
                        className="px-4 py-2 bg-navy-100 text-navy-800 rounded-lg text-sm font-semibold hover:bg-navy-200"
                      >
                        Browse Files
                      </button>
                      <button
                        onClick={() => handleDisconnect('dropbox')}
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleConnect('dropbox')}
                      className="px-4 py-2 bg-navy-900 text-white rounded-lg text-sm font-semibold hover:bg-navy-800"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* File Browser */}
          {selectedProvider && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {selectedProvider === 'google_drive' ? 'Google Drive' : 'Dropbox'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {browserPath.length > 0 ? `/ ${browserPath.join(' / ')}` : '/ Root'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProvider(null);
                    setCurrentFiles([]);
                    setCurrentFolders([]);
                    setBrowserPath([]);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div className="p-4">
                {isLoadingFiles ? (
                  <div className="py-8 text-center text-slate-500">
                    <div className="w-8 h-8 border-2 border-navy-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"/>
                    Loading files...
                  </div>
                ) : (
                  <div className="space-y-1">
                    {currentFolders.map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => handleNavigateFolder(folder)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-left"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1">
                          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                        </svg>
                        <span className="font-medium text-slate-700">{folder.name}</span>
                      </button>
                    ))}
                    {currentFiles.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <div>
                            <p className="font-medium text-slate-700">{file.name}</p>
                            <p className="text-xs text-slate-400">
                              {(file.size / 1024).toFixed(1)} KB • {new Date(file.modifiedTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-navy-100 text-navy-800 rounded-lg text-xs font-semibold hover:bg-navy-200">
                          Import
                        </button>
                      </div>
                    ))}
                    {currentFiles.length === 0 && currentFolders.length === 0 && (
                      <p className="text-center text-slate-500 py-8">No files in this folder</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Models Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">AI Model Configuration</h3>
              <p className="text-sm text-slate-500 mt-1">
                Configure which AI models to use for different tasks
              </p>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Available Models</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'cerebras', name: 'Cerebras (Llama 3.3 70B)', status: 'active', speed: 'Ultra-Fast' }, { id: 'groq', name: 'GROQ (Llama 3.3)', status: 'active', speed: 'Fast' },
                    { id: 'gemini', name: 'Google Gemini', status: 'available', speed: 'Medium' },
                    { id: 'mistral', name: 'Mistral', status: 'available', speed: 'Fast' },
                    { id: 'cohere', name: 'Cohere', status: 'available', speed: 'Medium' },
                    { id: 'together', name: 'Together AI', status: 'available', speed: 'Fast' },
                    { id: 'cerebras', name: 'Cerebras', status: 'available', speed: 'Very Fast' },
                  ].map(model => (
                    <div
                      key={model.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        preferredLLM === model.id
                          ? 'border-navy-500 bg-navy-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setPreferredLLM(model.id as LLMProvider)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-slate-800">{model.name}</span>
                        {preferredLLM === model.id && (
                          <span className="w-2 h-2 bg-navy-500 rounded-full"/>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        model.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {model.speed}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="font-semibold text-slate-800 mb-4">AI Behavior</h4>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">RAG (Retrieval Augmented Generation)</p>
                      <p className="text-sm text-slate-500">Use uploaded documents and wiki for context</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ragEnabled}
                      onChange={(e) => setRagEnabled(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-navy-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                    <div>
                      <p className="font-medium text-slate-800">Citation Mode (Default)</p>
                      <p className="text-sm text-slate-500">Require legal citations in all responses</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={citationMode}
                      onChange={(e) => setCitationMode(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-navy-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="font-semibold text-amber-900">All models are free to use</h4>
                <p className="text-sm text-amber-700 mt-1">
                  We use free tiers from multiple AI providers. No API keys required from you.
                  The system automatically balances between providers for reliability.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Research Tab */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Free Legal Databases</h3>
              <p className="text-sm text-slate-500 mt-1">
                These databases are automatically searched
              </p>
            </div>

            <div className="p-4 space-y-3">
              {[
                { name: 'CourtListener', desc: 'Case law from all US jurisdictions', status: 'active' },
                { name: 'NY Legislature', desc: 'NY statutes and regulations', status: 'active' },
                { name: 'Cornell LII', desc: 'Federal statutes and regulations', status: 'active' },
                { name: 'Crowdsourced DB', desc: 'Cases contributed by users', status: 'active' },
              ].map((db, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-slate-800">{db.name}</p>
                    <p className="text-sm text-slate-500">{db.desc}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    ✓ Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Premium Databases (Your Subscription)</h3>
              <p className="text-sm text-slate-500 mt-1">
                Connect your Westlaw or Lexis account for enhanced research
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-red-700">W</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Westlaw</h4>
                    <p className="text-sm text-slate-500">Thomson Reuters</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  When you search, we'll open a browser window for you to log into Westlaw.
                  Cases you view will be added to the shared database for all users.
                </p>
                <button className="w-full py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Connect Westlaw Account
                </button>
              </div>

              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-700">L+</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">LexisNexis</h4>
                    <p className="text-sm text-slate-500">RELX Group</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Same as Westlaw - authenticate with your account and contribute to the shared knowledge base.
                </p>
                <button className="w-full py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Connect LexisNexis Account
                </button>
              </div>
            </div>
          </div>

          <div className="bg-navy-50 border border-navy-200 rounded-xl p-4">
            <div className="flex gap-3">
              <span className="text-xl">🌐</span>
              <div>
                <h4 className="font-semibold text-navy-900">Building a Free Legal Database Together</h4>
                <p className="text-sm text-navy-700 mt-1">
                  Every time you or another attorney looks up a case via Westlaw or Lexis, 
                  that case is saved to our crowdsourced database. Over time, this creates 
                  a free comprehensive legal database for all assigned counsel attorneys!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <ProfileTab />
      )}
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [barNumber, setBarNumber] = useState('');
  const [practiceArea, setPracticeArea] = useState('Criminal Defense');
  const [county, setCounty] = useState('New York (Manhattan)');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || '');
      const saved = localStorage.getItem('acc_profile');
      if (saved) {
        const p = JSON.parse(saved);
        setBarNumber(p.barNumber || '');
        setPracticeArea(p.practiceArea || 'Criminal Defense');
        setCounty(p.county || 'New York (Manhattan)');
      }
    }
  }, [user]);

  const saveProfile = async () => {
    try {
      if (displayName && user?.provider !== 'demo') {
        await updateUserProfile(displayName);
      }
      localStorage.setItem('acc_profile', JSON.stringify({ barNumber, practiceArea, county, displayName }));
      setProfileMsg('Profile saved!');
      setProfileSaved(true);
      setTimeout(() => { setProfileMsg(''); setProfileSaved(false); }, 3000);
    } catch (err: any) {
      setProfileMsg('Error saving: ' + (err.message || 'Unknown error'));
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) { setPasswordMsg('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg('Passwords do not match'); return; }
    try {
      await changePassword(newPassword);
      setPasswordMsg('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err: any) {
      setPasswordMsg(err.message?.includes('requires-recent-login')
        ? 'Please log out and log back in, then try again (security requirement).'
        : 'Error: ' + (err.message || 'Unknown error'));
    }
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'admin': return { text: 'Admin', color: 'bg-red-100 text-red-700', desc: 'Full control — manage users, edit everything, lock entries' };
      case 'editor': return { text: 'Editor', color: 'bg-amber-100 text-amber-700', desc: 'Can directly edit wiki entries, approve edits, verify content' };
      case 'contributor': return { text: 'Contributor', color: 'bg-blue-100 text-blue-700', desc: 'Can suggest edits and create draft entries' };
      default: return { text: 'Viewer', color: 'bg-slate-100 text-slate-600', desc: 'Read-only access' };
    }
  };

  const role = roleLabel(user?.role || 'viewer');

  return (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Account</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-navy-100 flex items-center justify-center text-xl font-bold text-navy-700">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-sm text-slate-500">{user?.email || 'No email'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${role.color}`}>{role.text}</span>
                <span className="text-[10px] text-slate-400">{role.desc}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attorney Profile */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">Attorney Profile</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g., John Smith, Esq." className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bar Number</label>
            <input type="text" value={barNumber} onChange={e => setBarNumber(e.target.value)} placeholder="NY Bar #" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Practice Area</label>
            <select value={practiceArea} onChange={e => setPracticeArea(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20">
              <option>Criminal Defense</option>
              <option>Family Court / Custody</option>
              <option>Matrimonial / Divorce</option>
              <option>All of the above</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Primary County</label>
            <select value={county} onChange={e => setCounty(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20">
              <option>New York (Manhattan)</option>
              <option>Kings (Brooklyn)</option>
              <option>Queens</option>
              <option>Bronx</option>
              <option>Richmond (Staten Island)</option>
              <option>Nassau</option>
              <option>Suffolk</option>
              <option>Westchester</option>
            </select>
          </div>
          {profileMsg && <p className={`text-sm font-medium ${profileSaved ? 'text-green-600' : 'text-red-600'}`}>{profileMsg}</p>}
          <button onClick={saveProfile} className="w-full py-3 bg-navy-900 text-white rounded-lg font-semibold hover:bg-navy-800 transition-colors">
            Save Profile
          </button>
        </div>
      </div>

      {/* Change Password */}
      {user?.provider !== 'demo' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Change Password</h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500/20" />
            </div>
            {passwordMsg && <p className={`text-sm font-medium ${passwordMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{passwordMsg}</p>}
            <button onClick={handleChangePassword} disabled={!newPassword || !confirmPassword} className="w-full py-3 bg-navy-900 text-white rounded-lg font-semibold hover:bg-navy-800 disabled:opacity-50 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
