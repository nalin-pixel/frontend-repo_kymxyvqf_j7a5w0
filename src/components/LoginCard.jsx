import React, { useState } from 'react';
import { Mail, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LoginCard({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      if (!email || !password) throw new Error('Masukkan email dan kata sandi');
      const base = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || 'http://localhost:8000';
      const res = await fetch(`${base}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || 'Gagal login');
      }
      onLogin(data.user);
      if (data.email_notification === 'sent') {
        setInfo('Email notifikasi terkirim');
      } else if (typeof data.email_notification === 'string' && data.email_notification !== 'skipped') {
        setInfo(`Email notifikasi gagal: ${data.email_notification}`);
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900">Masuk</h2>
      <p className="text-sm text-slate-600 mb-4">Gunakan akun perusahaan Anda</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 size={16} />
            <span>{info}</span>
          </div>
        )}
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@perusahaan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            className="w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin" size={18} />} Masuk
        </button>
      </form>
    </div>
  );
}
