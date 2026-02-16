"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { resetPassword } from '@/lib/auth';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const { loginWithGoogle, loginWithApple, loginWithFacebook, loginWithEmail, loginDemo } = useAuth();
  const router = useRouter();

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook' | 'demo') => {
    setError('');
    setIsLoading(provider);

    let result;
    try {
      switch (provider) {
        case 'google':
          result = await loginWithGoogle();
          break;
        case 'apple':
          result = await loginWithApple();
          break;
        case 'facebook':
          result = await loginWithFacebook();
          break;
        case 'demo':
          result = await loginDemo();
          break;
      }

      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Login failed');
        setIsLoading(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(null);
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Navigation */}
      <nav className="h-16 sm:h-20 flex items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image 
            src="/logo-icon.svg" 
            alt="18B Lawyer" 
            width={36} 
            height={36}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="text-white text-base sm:text-xl font-semibold tracking-wide uppercase">
            18B Lawyer
          </span>
        </Link>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Welcome</h1>
              <p className="text-slate-500 text-sm">Sign in to access your dashboard</p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Email/Password Login */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!email || !password) return;
              setError('');
              setIsLoading('email');
              try {
                const result = await loginWithEmail(email, password);
                if (result.success) {
                  router.push('/dashboard');
                } else {
                  setError(result.error || 'Login failed');
                  setIsLoading(null);
                }
              } catch {
                setError('Login failed');
                setIsLoading(null);
              }
            }} className="space-y-3 mb-4">
              <div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300" />
              </div>
              <div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-300" />
              </div>
              <button type="submit" disabled={isLoading !== null || !email || !password} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading === 'email' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                Sign In
              </button>
              <div className="text-center">
                {resetSent ? (
                  <p className="text-xs text-green-600 font-medium">✓ Password reset email sent! Check your inbox.</p>
                ) : (
                  <button type="button" onClick={async () => {
                    if (!email) { setError('Enter your email first'); return; }
                    try { await resetPassword(email); setResetSent(true); setError(''); }
                    catch { setError('Could not send reset email. Check the address.'); }
                  }} className="text-xs text-navy-600 hover:text-navy-800 hover:underline">
                    Forgot your password?
                  </button>
                )}
              </div>
            </form>

            {/* Divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">or continue with</span></div>
            </div>

            <div className="space-y-3">
              {/* Google */}
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading !== null}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === 'google' ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </button>

              {/* Apple */}
              <button
                onClick={() => handleSocialLogin('apple')}
                disabled={isLoading !== null}
                className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === 'apple' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                )}
                Continue with Apple
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading !== null}
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === 'facebook' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                Continue with Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-medium">or</span>
              </div>
            </div>

            {/* Demo Login */}
            <button
              onClick={() => handleSocialLogin('demo')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading === 'demo' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              )}
              Try Demo Account
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Demo mode uses sample data. No account required.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-center text-slate-500 text-xs mt-2">
            &copy; 2026 18B Lawyer. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
