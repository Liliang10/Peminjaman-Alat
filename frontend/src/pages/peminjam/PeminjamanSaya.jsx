import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function PeminjamanSaya() {
  const [riwayatSaya, setRiwayatSaya] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const navigate = useNavigate();

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

  const handleCancelLoan = async (id) => {
    if (!window.confirm('Yakin ingin membatalkan permohonan peminjaman ini?')) return;
    setCancellingId(id);
    try {
      await fetchAPI(`/peminjaman/${id}`, { method: 'DELETE' });
      setSuccess('Permohonan peminjaman berhasil dibatalkan.');
      setTimeout(() => setSuccess(''), 3000);
      await loadRiwayat();
    } catch (err) {
      alert('Gagal membatalkan pengajuan: ' + err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-indigo-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              My Requests
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Status Peminjaman Saya</h1>
            <p className="text-xs text-slate-500 mt-0.5">Pantau status persetujuan, masa pinjam, dan pengembalian alat Anda</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/peminjam/ajukan')}
              className="px-4 py-2.5 bg-slate-950 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer border border-slate-800 transition-all"
            >
              <span>+</span>
              <span>Ajukan Peminjaman</span>
            </button>
            <button
              onClick={loadRiwayat}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              🔄 Segarkan
            </button>
          </div>
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

        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3 px-6 w-16">No</th>
                <th className="py-3 px-6">Nama Alat</th>
                <th className="py-3 px-6">Tanggal Pinjam</th>
                <th className="py-3 px-6">Tanggal Pengembalian</th>
                <th className="py-3 px-6">Keperluan</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Memuat status peminjaman Anda...
                  </td>
                </tr>
              ) : riwayatSaya.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Anda belum memiliki riwayat atau permohonan peminjaman alat.
                  </td>
                </tr>
              ) : (
                riwayatSaya.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-400">{index + 1}</td>
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
                    <td className="py-3.5 px-6 text-slate-500 italic max-w-xs truncate">{item.reason || '-'}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.status === 'Disetujui' || item.status === 'Dipinjam'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Ditolak'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : item.status === 'Selesai'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status || 'Menunggu'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {item.status === 'Menunggu' ? (
                        <button
                          disabled={cancellingId === item.id}
                          onClick={() => handleCancelLoan(item.id)}
                          className="px-2.5 py-1 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Batalkan
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold">-</span>
                      )}
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
