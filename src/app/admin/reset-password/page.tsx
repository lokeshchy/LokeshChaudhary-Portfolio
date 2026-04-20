'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const MIN_PASSWORD_LEN = 10;

function AdminResetPasswordForm() {
  const params = useSearchParams();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Missing reset token in URL.');
      return;
    }
    if (password.length < MIN_PASSWORD_LEN) {
      setError(`Password must be at least ${MIN_PASSWORD_LEN} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Reset failed');
        return;
      }
      setMessage(data.message || 'Password reset successful.');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card shadow-card p-8 border border-border">
          <h1 className="text-2xl font-semibold text-primary mb-2">Reset Password</h1>
          <p className="text-muted text-sm mb-6">
            Set a new admin password. This reset link is one-time and expires shortly.
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
              <label className="block text-sm font-medium text-primary mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-button bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                minLength={MIN_PASSWORD_LEN}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-button bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                minLength={MIN_PASSWORD_LEN}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-cta">
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
            <Link
              href="/admin/login"
              className="block w-full text-center rounded-button border border-border px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-16">
          <div className="text-muted text-sm">Loading reset form...</div>
        </div>
      }
    >
      <AdminResetPasswordForm />
    </Suspense>
  );
}
