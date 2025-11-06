import React, { useMemo } from 'react';
import { CheckCircle2, Clock, FileDown } from 'lucide-react';

function toCSV(rows) {
  const header = ['Tanggal', 'Jam Masuk', 'Jam Pulang', 'Durasi', 'Keterangan'];
  const data = rows.map(r => [r.tanggal, r.jamMasuk, r.jamPulang || '', r.durasi || '', r.ket]);
  return [header, ...data].map(line => line.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
}

export default function Dashboard({ records = [], onAbsenMasuk, onAbsenPulang, onSubmitKonfirmasi }) {
  const canSubmit = useMemo(() => records.some(r => r.ket === 'Belum Submit'), [records]);

  function exportCSV() {
    const csv = toCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'absensi.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={onAbsenMasuk} className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Absen Masuk</button>
        <button onClick={onAbsenPulang} className="px-4 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700">Absen Pulang</button>
        <button onClick={onSubmitKonfirmasi} disabled={!canSubmit} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
          <CheckCircle2 size={18} /> Submit
        </button>
        <button onClick={exportCSV} className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-2">
          <FileDown size={18} /> Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-3 py-2">Tanggal</th>
              <th className="text-left px-3 py-2">Jam Masuk</th>
              <th className="text-left px-3 py-2">Jam Pulang</th>
              <th className="text-left px-3 py-2">Durasi</th>
              <th className="text-left px-3 py-2">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-500 flex items-center justify-center gap-2">
                  <Clock size={18} /> Belum ada data absensi
                </td>
              </tr>
            )}
            {records.map((r, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                <td className="px-3 py-2">{r.tanggal}</td>
                <td className="px-3 py-2">{r.jamMasuk}</td>
                <td className="px-3 py-2">{r.jamPulang || '-'}</td>
                <td className="px-3 py-2">{r.durasi || '-'}</td>
                <td className="px-3 py-2">{r.ket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
