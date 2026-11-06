import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function CetakLaporan() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/peminjaman');
      setLoans(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat data laporan peminjaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const filteredLoans = loans.filter((item) => {
    if (statusFilter && item.status !== statusFilter) return false;
    if (startDate) {
      const itemDate = new Date(item.loan_date);
      const start = new Date(startDate);
      if (itemDate < start) return false;
    }
    if (endDate) {
      const itemDate = new Date(item.loan_date);
      const end = new Date(endDate);
      if (itemDate > end) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    if (filteredLoans.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const headers = ['No', 'Peminjam', 'Email', 'Nama Alat', 'Kode Alat', 'Tanggal Pinjam', 'Tanggal Pengembalian', 'Status'];
    const rows = filteredLoans.map((l, idx) => [
      idx + 1,
      `"${l.user_name || ''}"`,
      `"${l.user_email || ''}"`,
      `"${l.tool_name || ''}"`,
      `"${l.tool_code || ''}"`,
      l.loan_date ? new Date(l.loan_date).toLocaleDateString('id-ID') : '',
      l.return_date ? new Date(l.return_date).toLocaleDateString('id-ID') : '',
      `"${l.status || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Peminjaman_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 p-8 overflow-y-auto print:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 print:hidden">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Reporting Engine
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Cetak Laporan Peminjaman</h1>
            <p className="text-xs text-slate-500 mt-0.5">Filter periode dan unduh rekapitulasi data peminjaman inventaris</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer border border-slate-800 transition-all"
            >
              <span>🖨️</span>
              <span>Cetak Dokumen / PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>📊</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl print:hidden">
            {error}
          </div>
        )}

        {/* Filter Section (Hidden on Print) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-6 print:hidden">
          <span className="text-xs font-bold text-slate-800 block mb-3">Filter Periode & Status:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Mulai Dari</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Sampai Dengan</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Status Pinjaman</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
              >
                <option value="">Semua Status</option>
                <option value="Selesai">Selesai (Dikembalikan)</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Dipinjam">Dipinjam</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Preview Document */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs print:border-none print:shadow-none print:p-0">
          <div className="text-center border-b border-slate-200 pb-5 mb-6">
            <div className="inline-block px-3 py-1 bg-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
              Official Report
            </div>
            <h2 className="text-xl font-extrabold text-slate-950 uppercase tracking-wide">
              Laporan Peminjaman Alat & Inventaris
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Periode:{' '}
              {startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Awal Sistem'} -{' '}
              {endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Sekarang'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-2.5 px-4 w-12">No</th>
                  <th className="py-2.5 px-4">Peminjam</th>
                  <th className="py-2.5 px-4 min-w-[14rem]">Nama Alat</th>
                  <th className="py-2.5 px-4">Tanggal Pinjam</th>
                  <th className="py-2.5 px-4">Tanggal Pengembalian</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      Memuat laporan...
                    </td>
                  </tr>
                ) : filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      Tidak ada transaksi peminjaman pada periode yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filteredLoans.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 text-slate-400">{index + 1}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        {item.user_name || `User #${item.user_id}`}
                      </td>
                      <td className="py-2.5 px-4 text-slate-800 font-semibold">
                        {item.tool_name || `Alat #${item.tool_id}`}
                        {item.tool_code && (
                          <span className="ml-1.5 text-[10px] text-slate-700 bg-slate-50 border border-slate-100 px-1 py-0.2 rounded font-mono">
                            {item.tool_code}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">
                        {item.loan_date ? new Date(item.loan_date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="py-2.5 px-4 text-slate-700 font-medium">
                        {item.return_date ? new Date(item.return_date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-slate-900">{item.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
            <div>Total Transaksi Tercatat: {filteredLoans.length} Transaksi</div>
            <div>Dicetak pada: {new Date().toLocaleString('id-ID')}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
