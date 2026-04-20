'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp: otpStep ? otp : undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      if (data.requiresOtp) {
        setOtpStep(true);
        setMessage(data.message || 'OTP sent to your email');
        return;
      }
      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card shadow-card p-8 border border-border">
          <h1 className="text-2xl font-semibold text-primary mb-2">Admin Login</h1>
          <p className="text-muted text-sm mb-6">
            {otpStep
              ? 'Enter the OTP sent to your email to complete login.'
              : 'Sign in to manage your portfolio.'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/25 rounded-button px-3 py-2">
                {error}
              </div>
            )}
            {message && (
              <div className="text-sm text-cyan-300 bg-cyan-500/10 border border-cyan-400/30 rounded-button px-3 py-2">
                {message}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-button bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
                disabled={otpStep}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-button bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
                disabled={otpStep}
              />
            </div>
            {otpStep && (
              <div>
                <label className="block text-sm font-medium text-primary mb-1">One-Time Password</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-border rounded-button bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 tracking-[0.25em]"
                  placeholder="6-digit OTP"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cta"
            >
              {loading ? 'Please wait...' : otpStep ? 'Verify OTP' : 'Send OTP'}
            </button>
            {otpStep && (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setOtpStep(false);
                  setOtp('');
                  setMessage('');
                  setError('');
                }}
                className="w-full rounded-button border border-border px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Back to credentials
              </button>
            )}
            {!otpStep && (
              <Link
                href="/admin/forgot-password"
                className="block w-full text-center rounded-button border border-border px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
