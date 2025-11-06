import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 text-center text-xs text-slate-500 py-6">
      © {new Date().getFullYear()} Sistem Absensi. All rights reserved.
    </footer>
  );
}
