import React, { useEffect, useState } from 'react';

export default function Settings({ companyName, setCompanyName }) {
  const [companyDraft, setCompanyDraft] = useState(companyName || 'Sistem Absen');

  useEffect(() => {
    setCompanyDraft(companyName || 'Sistem Absen');
  }, [companyName]);

  function save() {
    const value = companyDraft?.trim() || 'Sistem Absen';
    setCompanyName(value);
    localStorage.setItem('company_name', value);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Pengaturan</h3>
        <p className="text-sm text-slate-600">Personalisasi aplikasi ini untuk kebutuhan perusahaan Anda.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Nama Perusahaan</label>
        <div className="flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-md border border-slate-300"
            value={companyDraft}
            onChange={(e) => setCompanyDraft(e.target.value)}
            placeholder="Contoh: PT Maju Mundur"
          />
          <button onClick={save} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Simpan</button>
        </div>
        <p className="text-xs text-slate-500">Nama ini akan tampil di bagian atas aplikasi.</p>
      </div>
    </div>
  );
}
