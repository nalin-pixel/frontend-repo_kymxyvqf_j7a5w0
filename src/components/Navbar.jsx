import { useState } from 'react';
import { Menu, User, LayoutDashboard, Settings, LogOut, PlusCircle } from 'lucide-react';

export default function Navbar({ onSelect, user, onLogout, companyName = 'Sistem Absen' }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-500" />
          <span className="font-semibold text-slate-800">{companyName}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <Menu className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
              role="menu"
            >
              <Item icon={LayoutDashboard} label="Dashboard" onClick={() => { onSelect('dashboard'); setOpen(false); }} />
              <Item icon={User} label="Profil" onClick={() => { onSelect('profile'); setOpen(false); }} />
              <Item icon={Settings} label="Pengaturan" onClick={() => { onSelect('settings'); setOpen(false); }} />
              <Item icon={PlusCircle} label="Tambah Akun" onClick={() => { onSelect('addAccount'); setOpen(false); }} />
              <div className="h-px bg-slate-200" />
              <Item icon={LogOut} label="Keluar" onClick={() => { setOpen(false); onLogout?.(); }} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Item({ icon: Icon, label, onClick }) {
  return (
    <button
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50"
      onClick={onClick}
      role="menuitem"
    >
      <Icon className="h-4 w-4 text-slate-500" />
      <span>{label}</span>
    </button>
  );
}
