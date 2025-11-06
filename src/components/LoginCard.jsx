import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginCard({ onSuccess, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate async login then transition
    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        onSuccess?.({ name: email.split('@')[0] || 'Pengguna', email });
      } else {
        setError('Email dan password wajib diisi.');
      }
    }, 900);
  };

  return (
    <div className="relative max-w-md mx-auto -mt-32">
      <AnimatePresence>
        <motion.div
          key="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-6 shadow-xl"
        >
          <h1 className="text-2xl font-semibold text-slate-800 text-center mb-6">Sistem Absensi Karyawan</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="nama@perusahaan.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white py-2.5 transition-colors"
            >
              {loading ? 'Memproses…' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button onClick={onRegister} className="text-sm text-slate-600 hover:text-slate-800 underline">
              Buat Akun Baru
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
