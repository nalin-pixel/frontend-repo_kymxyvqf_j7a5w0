import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Clock, LogIn, LogOut, Pencil, Check, X, ImagePlus } from 'lucide-react';

function formatDateTime(date) {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const d = new Date(date);
  const hariStr = hari[d.getDay()];
  const tanggal = d.getDate();
  const bulanStr = bulan[d.getMonth()];
  const tahun = d.getFullYear();
  const pad = (n) => String(n).padStart(2, '0');
  const jam = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  return { tanggalLengkap: `${hariStr}, ${tanggal} ${bulanStr} ${tahun}`, jam };
}

export default function Dashboard({ user, onUpdateUser }) {
  const [now, setNow] = useState(new Date());
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('absen_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setNameDraft(user?.name || '');
  }, [user?.name]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('absen_records', JSON.stringify(records));
  }, [records]);

  const { tanggalLengkap, jam } = useMemo(() => formatDateTime(now), [now]);

  const absenMasuk = () => {
    setRecords((prev) => [
      ...prev,
      { nama: user?.name || 'Pengguna', tanggal: tanggalLengkap, jamMasuk: jam, jamPulang: '-', durasi: '-', ket: 'Menunggu Pulang' },
    ]);
  };

  const absenPulang = () => {
    setRecords((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].nama === (user?.name || 'Pengguna') && copy[i].jamPulang === '-') {
          const start = copy[i].jamMasuk;
          const [sh, sm, ss] = start.split(':').map(Number);
          const startDate = new Date(now);
          startDate.setHours(sh || 0, sm || 0, ss || 0, 0);
          const diffMs = now - startDate;
          const hh = Math.max(0, Math.floor(diffMs / 3600000));
          const mm = Math.max(0, Math.floor((diffMs % 3600000) / 60000));
          copy[i] = { ...copy[i], jamPulang: jam, durasi: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, ket: 'Belum Submit' };
          return copy;
        }
      }
      // jika tidak ada record masuk, buat entri pulang mandiri (tetap butuh submit)
      return [
        ...copy,
        { nama: user?.name || 'Pengguna', tanggal: tanggalLengkap, jamMasuk: '-', jamPulang: jam, durasi: '00:00', ket: 'Belum Submit' },
      ];
    });
  };

  const hasUnsubmitted = useMemo(() => {
    return records.some(r => r.nama === (user?.name || 'Pengguna') && r.ket === 'Belum Submit');
  }, [records, user?.name]);

  const submit = () => {
    // Submit hanya berfungsi ketika sudah absen pulang (ket: Belum Submit)
    setRecords((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].nama === (user?.name || 'Pengguna') && copy[i].ket === 'Belum Submit') {
          copy[i] = { ...copy[i], ket: 'Terkonfirmasi' };
          break;
        }
      }
      return copy;
    });
  };

  const exportCSV = () => {
    const header = ['Nama Karyawan','Tanggal','Jam Masuk','Jam Pulang','Durasi','Keterangan'];
    const rows = records.map(r => [r.nama, r.tanggal, r.jamMasuk, r.jamPulang, r.durasi, r.ket]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/\"/g,'\"')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rekap-absensi.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveName = () => {
    const newName = nameDraft.trim();
    if (!newName) return;
    onUpdateUser?.({ ...user, name: newName });
    setIsEditing(false);
  };

  const handlePickPhoto = () => fileInputRef.current?.click();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      onUpdateUser?.({ ...user, photo: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const avatarSrc = user?.photo
    ? user.photo
    : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-slate-500">{tanggalLengkap}</p>
        <div className="mt-1 inline-flex items-center gap-2 text-3xl font-mono tracking-widest text-slate-800">
          <Clock className="h-7 w-7 text-sky-600" />
          <span>{jam}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="relative">
          <img src={avatarSrc} alt="avatar" className="h-16 w-16 rounded-full border object-cover" />
          <button
            onClick={handlePickPhoto}
            className="absolute -bottom-2 -right-2 inline-flex items-center justify-center h-8 w-8 rounded-full bg-white border border-slate-200 shadow hover:bg-slate-50"
            title="Ubah foto profil"
            type="button"
          >
            <ImagePlus className="h-4 w-4 text-slate-700" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm">Karyawan</p>
          {!isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-slate-800 font-medium">{user?.name || 'Pengguna'}</p>
              <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700" title="Edit nama" type="button">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <button onClick={handleSaveName} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700">
                <Check className="h-4 w-4" /> Simpan
              </button>
              <button onClick={() => { setIsEditing(false); setNameDraft(user?.name || ''); }} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200">
                <X className="h-4 w-4" /> Batal
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <button onClick={absenMasuk} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition">
          <LogIn className="h-4 w-4" />
          Absen Masuk
        </button>
        <button onClick={absenPulang} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition">
          <LogOut className="h-4 w-4" />
          Absen Pulang
        </button>
        <button
          onClick={submit}
          disabled={!hasUnsubmitted}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white shadow-sm transition ${hasUnsubmitted ? 'bg-violet-600 hover:bg-violet-700' : 'bg-violet-300 cursor-not-allowed'}`}
          title={hasUnsubmitted ? 'Konfirmasi rekap' : 'Submit aktif setelah Absen Pulang'}
        >
          Submit
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mb-6">Submit hanya aktif setelah Absen Pulang dan digunakan untuk mengkonfirmasi rekap.</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium text-slate-800">Rekap Absensi</h3>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-black">
            <Download className="h-4 w-4" />
            Ekspor ke Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <Th>Nama Karyawan</Th>
                <Th>Tanggal</Th>
                <Th>Jam Masuk</Th>
                <Th>Jam Pulang</Th>
                <Th>Durasi</Th>
                <Th>Keterangan</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">Belum ada data.</td>
                </tr>
              ) : (
                records.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <Td>{r.nama}</Td>
                    <Td>{r.tanggal}</Td>
                    <Td>{r.jamMasuk}</Td>
                    <Td>{r.jamPulang}</Td>
                    <Td>{r.durasi}</Td>
                    <Td>{r.ket}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 font-medium text-left">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 text-slate-700">{children}</td>;
}
