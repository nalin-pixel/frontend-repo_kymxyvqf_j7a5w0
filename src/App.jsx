import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import HeroSpline from './components/HeroSpline.jsx';
import LoginCard from './components/LoginCard.jsx';
import Dashboard from './components/Dashboard.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  const handleLoginSuccess = (u) => {
    setUser(u);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
  };

  const handleUpdateUser = (updated) => {
    setUser(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-white text-slate-800">
      {!user ? (
        <>
          <HeroSpline />
          <LoginCard onSuccess={handleLoginSuccess} onRegister={() => alert('Form pendaftaran akan ditambahkan.')} />
          <Footer />
        </>
      ) : (
        <>
          <Navbar onSelect={setPage} user={user} onLogout={handleLogout} />
          <AnimatePresence mode="wait">
            {page === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Dashboard user={user} onUpdateUser={handleUpdateUser} />
              </motion.div>
            )}

            {page === 'profile' && (
              <motion.section
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto px-4 py-12"
              >
                <h2 className="text-xl font-semibold mb-6">Profil</h2>
                <div className="rounded-xl border border-slate-200 bg-white p-6 flex items-center gap-6">
                  <img
                    src={user?.photo || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt="avatar"
                    className="h-16 w-16 rounded-full border object-cover"
                  />
                  <div>
                    <p className="text-slate-900 font-medium">{user.name}</p>
                    <p className="text-slate-500 text-sm">{user.email}</p>
                    <p className="text-emerald-600 text-sm mt-1">Status: Aktif</p>
                  </div>
                </div>
              </motion.section>
            )}

            {page === 'settings' && (
              <motion.section
                key="settings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto px-4 py-12"
              >
                <h2 className="text-xl font-semibold mb-6">Pengaturan</h2>
                <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
                  <div>
                    <label className="block text-sm text-slate-600 mb-2">Ganti Background</label>
                    <div className="flex gap-3">
                      <Swatch color="from-sky-50 via-indigo-50 to-white" label="Biru" />
                      <Swatch color="from-emerald-50 via-teal-50 to-white" label="Hijau" />
                      <Swatch color="from-rose-50 via-pink-50 to-white" label="Merah" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-800">Privasi Data</p>
                      <p className="text-slate-500 text-sm">Tampilkan email pada profil</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-black">Simpan Perubahan</button>
                  </div>
                </div>
              </motion.section>
            )}

            {page === 'addAccount' && (
              <motion.section
                key="addAccount"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-3xl mx-auto px-4 py-12"
              >
                <h2 className="text-xl font-semibold mb-6">Tambah Akun</h2>
                <form
                  onSubmit={(e) => { e.preventDefault(); alert('Akun baru berhasil ditambahkan (demo).'); }}
                  className="rounded-xl border border-slate-200 bg-white p-6 grid gap-4"
                >
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Nama</label>
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Email</label>
                    <input type="email" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Password</label>
                    <input type="password" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-500 outline-none" required />
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700">Tambah</button>
                  </div>
                </form>
              </motion.section>
            )}
          </AnimatePresence>

          <Footer />
        </>
      )}
    </div>
  );
}

function Swatch({ color, label }) {
  return (
    <button
      onClick={() => document.body.classList.add('transition-colors')}
      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${color} border border-slate-200`}
      title={label}
      aria-label={label}
      type="button"
    />
  );
}

export default App;
