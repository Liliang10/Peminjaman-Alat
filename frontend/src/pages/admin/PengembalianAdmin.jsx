import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function PengembalianAdmin() {
  const [pengembalianList, setPengembalianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/peminjaman');
      const selesai = (data || []).filter((item) => item.status === 'Selesai');
      setPengembalianList(selesai);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengembalian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Riwayat Pengembalian Alat</h1>
            <p className="text-xs text-slate-500 mt-0.5">Daftar alat yang telah selesai dipinjam dan dikembalikan</p>
          </div>
          <button
            onClick={loadData}
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
                <th className="py-3 px-6 font-semibold">Peminjam</th>
                <th className="py-3 px-6 font-semibold">Alat</th>
                <th className="py-3 px-6 font-semibold">Tanggal Pinjam</th>
                <th className="py-3 px-6 font-semibold">Tanggal Kembali</th>
                <th className="py-3 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Memuat riwayat pengembalian...
                  </td>
                </tr>
              ) : pengembalianList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Belum ada riwayat alat yang dikembalikan (Status: Selesai).
                  </td>
                </tr>
              ) : (
                pengembalianList.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-6 font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">{item.user_name || `User #${item.user_id}`}</td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">{item.tool_name || `Alat #${item.tool_id}`}</td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {item.loan_date ? new Date(item.loan_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {item.return_date ? new Date(item.return_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.status}
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