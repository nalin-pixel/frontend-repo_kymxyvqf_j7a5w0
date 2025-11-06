import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import LoginCard from './components/LoginCard';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Footer from './components/Footer';
import HeroSpline from './components/HeroSpline';

function nowParts() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const tanggal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const jam = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { tanggal, jam };
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('absen_records') || '[]'));
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('company_name') || 'Sistem Absen');

  useEffect(() => {
    localStorage.setItem('absen_records', JSON.stringify(records));
  }, [records]);

  function handleLogin(u) {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
  }

  function onAbsenMasuk() {
    const { tanggal, jam } = nowParts();
    const newRec = { tanggal, jamMasuk: jam, ket: 'Menunggu Pulang' };
    setRecords((prev) => [newRec, ...prev]);
  }

  function onAbsenPulang() {
    const { jam } = nowParts();
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.ket === 'Menunggu Pulang');
      if (idx === -1) return prev;
      const start = prev[idx].jamMasuk;
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = jam.split(':').map(Number);
      const dur = (eh * 60 + em) - (sh * 60 + sm);
      const h = Math.floor(dur / 60).toString().padStart(2, '0');
      const m = (dur % 60).toString().padStart(2, '0');
      const updated = { ...prev[idx], jamPulang: jam, durasi: `${h}:${m}`, ket: 'Belum Submit' };
      const copy = [...prev];
      copy[idx] = updated;
      return [...copy];
    });
  }

  function onSubmitKonfirmasi() {
    setRecords((prev) => prev.map((r) => (r.ket === 'Belum Submit' ? { ...r, ket: 'Terkonfirmasi' } : r)));
  }

  function onUpdateUser(next) {
    setUser(next);
    localStorage.setItem('user', JSON.stringify(next));
  }

  const content = useMemo(() => {
    if (!user) {
      return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
          <HeroSpline />
          <LoginCard onLogin={handleLogin} />
        </div>
      );
    }
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Navbar companyName={companyName} page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        {page === 'dashboard' && (
          <Dashboard
            records={records}
            onAbsenMasuk={onAbsenMasuk}
            onAbsenPulang={onAbsenPulang}
            onSubmitKonfirmasi={onSubmitKonfirmasi}
          />
        )}
        {page === 'profile' && <Profile user={user} onUpdateUser={onUpdateUser} />}
        {page === 'settings' && <Settings companyName={companyName} setCompanyName={setCompanyName} />}
      </div>
    );
  }, [user, page, records, companyName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {content}
      <Footer />
    </div>
  );
}
