import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { fetchAPI } from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [tools, setTools] = useState([]);
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const toolsData = await fetchAPI('/alat').catch(() => []);
        if (isMounted) setTools(toolsData || []);

        const loansData = await fetchAPI('/peminjaman').catch(() => []);
        if (isMounted) setLoans(loansData || []);

        if (user?.role === 'admin') {
          const usersData = await fetchAPI('/users').catch(() => []);
          if (isMounted) setUsers(usersData || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, [user?.role]);

  // Real calculated metrics
  const totalTools = tools.length;
  const availableTools = tools.filter((t) => t.status === 'Tersedia' && t.stock > 0).length;
  const borrowedTools = tools.filter((t) => t.status === 'Dipinjam' || t.stock === 0).length;
  const pendingLoans = loans.filter((l) => l.status === 'Menunggu' || !l.status).length;
  const activeLoans = loans.filter((l) => l.status === 'Disetujui' || l.status === 'Dipinjam').length;
  const completedLoans = loans.filter((l) => l.status === 'Selesai').length;
  const totalUsersCount = users.length;

  const getCards = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Inventaris Alat', value: totalTools, icon: '📦', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { title: 'Alat Tersedia', value: availableTools, icon: '✅', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { title: 'Sedang Dipinjam', value: borrowedTools, icon: '⏳', color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { title: 'Menunggu Persetujuan', value: pendingLoans, icon: '🔔', color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { title: 'Total Pengguna', value: totalUsersCount, icon: '👥', color: 'text-purple-600 bg-purple-50 border-purple-100' },
          { title: 'Peminjaman Selesai', value: completedLoans, icon: '📋', color: 'text-teal-600 bg-teal-50 border-teal-100' },
        ];
      case 'petugas':
        return [
          { title: 'Total Inventaris', value: totalTools, icon: '📦', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { title: 'Alat Siap Dipinjam', value: availableTools, icon: '✅', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { title: 'Perlu Verifikasi', value: pendingLoans, icon: '🔔', color: 'text-rose-600 bg-rose-50 border-rose-100' },
          { title: 'Sedang Dipinjam', value: activeLoans, icon: '⏳', color: 'text-amber-600 bg-amber-50 border-amber-100' },
        ];
      default: // peminjam
        return [
          { title: 'Katalog Alat Tersedia', value: availableTools, icon: '📦', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
          { title: 'Pinjaman Aktif Saya', value: activeLoans, icon: '⏳', color: 'text-amber-600 bg-amber-50 border-amber-100' },
          { title: 'Menunggu Persetujuan', value: pendingLoans, icon: '🔔', color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { title: 'Riwayat Selesai', value: completedLoans, icon: '✅', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        ];
    }
  };

  const filteredTools = tools.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Topbar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-indigo-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              System Overview
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 capitalize tracking-tight">
              Dashboard {user?.role || 'Pengguna'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Selamat datang kembali, <span className="font-semibold text-slate-800">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl shadow-xs">
              📅 {todayFormatted}
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {getCards().map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">{card.title}</span>
                <div className="text-2xl font-black text-slate-950 tracking-tight">
                  {loading ? '...' : card.value}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${card.color} shadow-xs group-hover:scale-105 transition-transform`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Live Data Table: Daftar Katalog Peralatan */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
            <div>
              <h2 className="font-bold text-sm text-slate-950">Katalog Peralatan Terkini</h2>
              <p className="text-xs text-slate-500">Status ketersediaan inventaris alat di sistem</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari kode atau nama alat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/20 transition-all"
              />
              <span className="text-xs font-bold px-3 py-1.5 bg-slate-950 text-indigo-300 rounded-xl whitespace-nowrap border border-slate-800">
                {filteredTools.length} Alat
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3 px-6 w-16">No</th>
                  <th className="py-3 px-6">Kode Alat</th>
                  <th className="py-3 px-6">Nama Alat</th>
                  <th className="py-3 px-6">Kategori</th>
                  <th className="py-3 px-6">Stok</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      Memuat katalog alat...
                    </td>
                  </tr>
                ) : filteredTools.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      Tidak ada alat yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredTools.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-6">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {item.code || `ALT-${item.id}`}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-6 text-slate-600">{item.category_name || 'Umum'}</td>
                      <td className="py-3.5 px-6 font-bold text-slate-800">{item.stock || 0} unit</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            item.status === 'Tersedia' && item.stock > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.status === 'Perbaikan'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.stock <= 0 && item.status === 'Tersedia' ? 'Habis' : item.status || 'Tersedia'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
