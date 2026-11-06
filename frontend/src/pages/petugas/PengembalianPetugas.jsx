import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function PengembalianPetugas() {
  const [pinjamAktif, setPinjamAktif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/peminjaman');
      // Show loans that are Disetujui / Dipinjam
      const active = (data || []).filter(
        (item) => item.status === 'Disetujui' || item.status === 'Dipinjam'
      );
      setPinjamAktif(active);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengembalian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReturn = async (id, toolName) => {
    if (!window.confirm(`Konfirmasi bahwa alat "${toolName}" telah dikembalikan dalam kondisi baik?`))
      return;
    setProcessingId(id);
    setError('');
    try {
      await fetchAPI(`/peminjaman/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Selesai' }),
      });
      setSuccess(`Pengembalian alat "${toolName}" berhasil dikonfirmasi! Stok inventaris telah dikembalikan.`);
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      alert('Gagal memproses pengembalian: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredList = pinjamAktif.filter(
    (item) =>
      item.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tool_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tool_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-indigo-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Return Intake
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Proses Pengembalian Alat</h1>
            <p className="text-xs text-slate-500 mt-0.5">Konfirmasi penerimaan alat dan sinkronisasi otomatis ketersediaan stok</p>
          </div>
          <button
            onClick={loadData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            🔄 Segarkan
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700 font-bold">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-700 font-bold">✕</button>
          </div>
        )}

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="Cari peminjam, nama alat, atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-600 w-full sm:w-80"
          />
          <span className="text-xs font-bold px-3 py-1 bg-slate-950 text-indigo-300 rounded-xl border border-slate-800">
            Alat Belum Kembali: {filteredList.length} Item
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3 px-6 w-16">No</th>
                <th className="py-3 px-6">Peminjam</th>
                <th className="py-3 px-6">Nama Alat</th>
                <th className="py-3 px-6">Tanggal Pinjam</th>
                <th className="py-3 px-6">Tanggal Pengembalian</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Memuat data alat yang sedang dipinjam...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Tidak ada alat yang sedang dipinjam saat ini.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{item.user_name || `User #${item.user_id}`}</div>
                      <div className="text-[11px] text-slate-400">{item.user_email}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">{item.tool_name || `Alat #${item.tool_id}`}</div>
                      {item.tool_code && (
                        <span className="inline-block mt-0.5 text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-mono font-medium">
                          {item.tool_code}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {item.loan_date ? new Date(item.loan_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">
                      {item.return_date ? new Date(item.return_date).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        disabled={processingId === item.id}
                        onClick={() => handleReturn(item.id, item.tool_name)}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer border border-slate-800 transition-all"
                      >
                        {processingId === item.id ? 'Memproses...' : 'Tandai Kembali'}
                      </button>
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
