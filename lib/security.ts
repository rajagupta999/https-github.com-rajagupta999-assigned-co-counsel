/**
 * Security Utilities for Assigned Co Counsel
 * 
 * Provides input validation, sanitization, and security helpers
 */

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize HTML input to prevent XSS
 * Strips all HTML tags and encodes special characters
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize string for safe database storage
 * Removes potentially dangerous characters
 */
export function sanitizeForDb(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove null bytes and other control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return 'unnamed';
  
  return filename
    .replace(/\.\./g, '') // Prevent path traversal
    .replace(/[/\\]/g, '') // Remove slashes
    .replace(/[<>:"|?*]/g, '') // Remove Windows-forbidden chars
    .replace(/^\.+/, '') // Remove leading dots
    .trim()
    .slice(0, 255) // Limit length
    || 'unnamed';
}

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (US format)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

/**
 * Validate string length
 */
export function isValidLength(
  input: string, 
  minLength: number = 0, 
  maxLength: number = 10000
): boolean {
  if (!input || typeof input !== 'string') return minLength === 0;
  return input.length >= minLength && input.length <= maxLength;
}

/**
 * Validate UUID format
 */
export function isValidUuid(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Server-side fallback
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token in session storage
 */
export function storeCsrfToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('csrf_token', token);
  }
}

/**
 * Get stored CSRF token
 */
export function getCsrfToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('csrf_token');
  }
  return null;
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = getCsrfToken();
  return storedToken !== null && token === storedToken;
}

// ============================================
// SESSION SECURITY
// ============================================

/**
 * Check if session has timed out (30 minutes of inactivity)
 */
export function isSessionExpired(lastActivityMs: number, timeoutMs: number = 30 * 60 * 1000): boolean {
  return Date.now() - lastActivityMs > timeoutMs;
}

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('last_activity', Date.now().toString());
  }
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem('last_activity');
    return stored ? parseInt(stored, 10) : Date.now();
  }
  return Date.now();
}

// ============================================
// SECURE RANDOM
// ============================================

/**
 * Generate a secure random string
 */
export function generateSecureId(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

// ============================================
// URL VALIDATION
// ============================================

/**
 * Validate and sanitize URL to prevent open redirect
 */
export function sanitizeRedirectUrl(url: string, allowedHosts: string[] = []): string {
  if (!url || typeof url !== 'string') return '/';
  
  try {
    // If it's a relative path, it's safe
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }
    
    const parsed = new URL(url);
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '/';
    }
    
    // Check against allowed hosts
    if (allowedHosts.length > 0 && !allowedHosts.includes(parsed.host)) {
      return '/';
    }
    
    return url;
  } catch {
    // If URL parsing fails, return safe default
    return '/';
  }
}

// ============================================
// LOGGING (for security events)
// ============================================

export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'invalid_input' | 'suspicious_activity' | 'csrf_failure';
  userId?: string;
  ip?: string;
  details: string;
  timestamp: string;
}

/**
 * Log a security event (should be sent to audit log in production)
 */
export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const fullEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  // In production, send to your audit log system
  console.warn('[SECURITY EVENT]', fullEvent);
  
  // TODO: Send to Firestore audit_logs collection via Cloud Function
}
