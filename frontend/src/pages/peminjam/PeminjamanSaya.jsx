import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function PeminjamanSaya() {
  const [riwayatSaya, setRiwayatSaya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRiwayat = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/peminjaman');
      setRiwayatSaya(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat riwayat peminjaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiwayat();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Status Peminjaman Saya</h1>
            <p className="text-xs text-slate-500 mt-0.5">Pantau status persetujuan dan pengembalian alat Anda</p>
          </div>
          <button
            onClick={loadRiwayat}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs">
                <th className="py-3 px-6 font-semibold">No</th>
                <th className="py-3 px-6 font-semibold">Nama Alat</th>
                <th className="py-3 px-6 font-semibold">Tanggal Pinjam</th>
                <th className="py-3 px-6 font-semibold">Batas Pengembalian</th>
                <th className="py-3 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Memuat status peminjaman...
                  </td>
                </tr>
              ) : riwayatSaya.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400">
                    Anda belum memiliki riwayat peminjaman.
                  </td>
                </tr>
              ) : (
                riwayatSaya.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-6 font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">{item.tool_name || `Alat #${item.tool_id}`}</td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {item.loan_date ? new Date(item.loan_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {item.return_date ? new Date(item.return_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.status === 'Disetujui'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'Ditolak'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.status === 'Selesai'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status || 'Menunggu'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}