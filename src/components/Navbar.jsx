import React from 'react';
import { Home, Settings, User, LogOut } from 'lucide-react';

function NavButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
        active ? 'bg-blue-600 text-white' : 'bg-white/60 hover:bg-white text-slate-700'
      }`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function Navbar({ companyName = 'Sistem Absen', page, setPage, onLogout, user }) {
  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-600 text-white grid place-items-center font-bold">SA</div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 font-semibold leading-none">{companyName}</h1>
            <span className="text-xs text-slate-500">Sistem Absensi Karyawan</span>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <NavButton
            icon={Home}
            label="Dashboard"
            active={page === 'dashboard'}
            onClick={() => setPage('dashboard')}
          />
          <NavButton
            icon={User}
            label="Profil"
            active={page === 'profile'}
            onClick={() => setPage('profile')}
          />
          <NavButton
            icon={Settings}
            label="Pengaturan"
            active={page === 'settings'}
            onClick={() => setPage('settings')}
          />
          {user && (
            <button
              onClick={onLogout}
              title="Keluar"
              className="ml-2 p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
            >
              <LogOut size={18} />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
