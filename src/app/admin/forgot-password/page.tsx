'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Unable to request reset link');
        return;
      }
      setMessage(data.message || 'If eligible, a reset link has been sent.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-card shadow-card p-8 border border-border">
          <h1 className="text-2xl font-semibold text-primary mb-2">Forgot Password</h1>
          <p className="text-muted text-sm mb-6">
            Enter your admin email. If eligible, a reset link is sent to your configured receiver email.
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
              <label className="block text-sm font-medium text-primary mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-button bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-cta">
              {loading ? 'Requesting...' : 'Send reset link'}
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
