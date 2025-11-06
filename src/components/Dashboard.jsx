import { useEffect, useMemo, useState } from 'react';
import { Download, Clock, LogIn, LogOut } from 'lucide-react';

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

export default function Dashboard({ user }) {
  const [now, setNow] = useState(new Date());
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('absen_records');
    return saved ? JSON.parse(saved) : [];
  });

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
      { nama: user?.name || 'Pengguna', tanggal: tanggalLengkap, jamMasuk: jam, jamPulang: '-', durasi: '-', ket: 'Masuk' },
    ]);
  };
  const absenPulang = () => {
    // cari record terakhir tanpa jam pulang
    setRecords((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].nama === (user?.name || 'Pengguna') && copy[i].jamPulang === '-') {
          const start = copy[i].jamMasuk;
          const [sh, sm, ss] = start.split(':').map(Number);
          const startDate = new Date(now);
          startDate.setHours(sh, sm, ss, 0);
          const diffMs = now - startDate;
          const hh = Math.floor(diffMs / 3600000);
          const mm = Math.floor((diffMs % 3600000) / 60000);
          copy[i] = { ...copy[i], jamPulang: jam, durasi: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, ket: 'Selesai' };
          return copy;
        }
      }
      // jika tidak ada, tambahkan entri pulang mandiri
      return [
        ...copy,
        { nama: user?.name || 'Pengguna', tanggal: tanggalLengkap, jamMasuk: '-', jamPulang: jam, durasi: '00:00', ket: 'Pulang' },
      ];
    });
  };

  const submit = () => {
    // in demo, submit hanya menambah catatan "Submit" tanpa logika tambahan
    setRecords((prev) => [
      ...prev,
      { nama: user?.name || 'Pengguna', tanggal: tanggalLengkap, jamMasuk: '-', jamPulang: '-', durasi: '-', ket: 'Submit' },
    ]);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-slate-500">{tanggalLengkap}</p>
        <div className="mt-1 inline-flex items-center gap-2 text-3xl font-mono tracking-widest text-slate-800">
          <Clock className="h-7 w-7 text-sky-600" />
          <span>{jam}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`} alt="avatar" className="h-12 w-12 rounded-full border" />
        <div className="text-center">
          <p className="text-slate-500 text-sm">Karyawan</p>
          <p className="text-slate-800 font-medium">{user?.name || 'Pengguna'}</p>
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
        <button onClick={submit} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition">
          Submit
        </button>
      </div>
      <p className="text-center text-xs text-slate-500 mb-6">Tombol dapat digunakan demo hari pertama (multi klik akan tetap direkap).</p>

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
