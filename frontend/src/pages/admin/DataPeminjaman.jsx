import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function DataPeminjaman() {
  const [pinjamList, setPinjamList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/peminjaman');
      setPinjamList(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data peminjaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus riwayat peminjaman ID #${id}?`)) return;
    try {
      await fetchAPI(`/peminjaman/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    }
  };

  const filteredList = pinjamList.filter((item) => {
    const matchesSearch =
      item.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tool_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tool_code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Loan Registry
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Data Peminjaman</h1>
            <p className="text-xs text-slate-500 mt-0.5">Semua riwayat pengajuan dan transaksi peminjaman alat di sistem</p>
          </div>
          <button
            onClick={loadData}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            🔄 Segarkan
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-slate-500 hover:text-slate-700 font-bold">✕</button>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
            <input
              type="text"
              placeholder="Cari nama peminjam, nama alat, atau kode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 w-full sm:w-80"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
            >
              <option value="">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Dipinjam">Dipinjam</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-950 text-slate-300 rounded-xl border border-slate-800">
            {filteredList.length} Transaksi
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3 px-6 w-16">No</th>
                <th className="py-3 px-6">Peminjam</th>
                <th className="py-3 px-6 min-w-[14rem]">Nama Alat</th>
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
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Memuat data peminjaman...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    Belum ada data peminjaman yang sesuai.
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
                        <span className="inline-block mt-0.5 text-[10px] text-slate-700 bg-slate-50 border border-slate-100 px-1.5 py-0.2 rounded font-mono font-medium">
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
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : item.status === 'Ditolak'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : item.status === 'Selesai'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.status || 'Menunggu'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2.5 py-1 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Hapus
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
