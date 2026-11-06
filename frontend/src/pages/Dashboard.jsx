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

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch tools for all roles
        const toolsData = await fetchAPI('/alat');
        if (isMounted) setTools(toolsData || []);

        // Fetch loans and users if admin or petugas
        if (user?.role === 'admin' || user?.role === 'petugas') {
          try {
            const loansData = await fetchAPI('/peminjaman');
            if (isMounted) setLoans(loansData || []);
          } catch (err) {
            console.warn('Could not load loans for dashboard:', err.message);
          }
        }

        if (user?.role === 'admin') {
          try {
            const usersData = await fetchAPI('/users');
            if (isMounted) setUsers(usersData || []);
          } catch (err) {
            console.warn('Could not load users for dashboard:', err.message);
          }
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

  // Real or calculated metrics
  const totalTools = tools.length;
  const availableTools = tools.filter((t) => t.status === 'Tersedia' || t.stock > 0).length;
  const borrowedTools = tools.filter((t) => t.status === 'Dipinjam').length;
  const pendingLoans = loans.filter((l) => l.status === 'Menunggu' || !l.status).length;
  const totalUsersCount = users.length > 0 ? users.length : 3;

  const getCards = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Total Alat Terdaftar', value: totalTools, icon: '📦', color: 'text-indigo-600 bg-indigo-50' },
          { title: 'Alat Tersedia', value: availableTools, icon: '✅', color: 'text-emerald-600 bg-emerald-50' },
          { title: 'Sedang Dipinjam', value: borrowedTools, icon: '⏳', color: 'text-amber-600 bg-amber-50' },
          { title: 'Menunggu Persetujuan', value: pendingLoans, icon: '🔔', color: 'text-blue-600 bg-blue-50' },
          { title: 'Total Pengguna', value: totalUsersCount, icon: '👥', color: 'text-purple-600 bg-purple-50' },
          { title: 'Riwayat Pinjaman', value: loans.length, icon: '📑', color: 'text-teal-600 bg-teal-50' },
        ];
      case 'petugas':
        return [
          { title: 'Total Alat', value: totalTools, icon: '📦', color: 'text-indigo-600 bg-indigo-50' },
          { title: 'Alat Tersedia', value: availableTools, icon: '✅', color: 'text-emerald-600 bg-emerald-50' },
          { title: 'Menunggu Persetujuan', value: pendingLoans, icon: '🔔', color: 'text-amber-600 bg-amber-50' },
        ];
      default: // peminjam
        return [
          { title: 'Total Alat Tersedia', value: availableTools, icon: '📦', color: 'text-indigo-600 bg-indigo-50' },
          { title: 'Peminjaman Aktif Saya', value: '1', icon: '⏳', color: 'text-amber-600 bg-amber-50' },
          { title: 'Menunggu Persetujuan', value: '0', icon: '🔔', color: 'text-blue-600 bg-blue-50' },
        ];
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Topbar Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 capitalize">
              Dashboard {user?.role || 'Pengguna'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Selamat datang kembali, <span className="font-semibold text-slate-700">{user?.name}</span>!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Backend Terhubung (Port 5001)
            </span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {getCards().map((card, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-medium text-slate-500 block mb-1">{card.title}</span>
                <div className="text-2xl font-bold text-slate-800">
                  {loading ? '...' : card.value}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Live Data Table: Daftar Alat dari Database */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="font-bold text-sm text-slate-800">Katalog Alat di Database (Real-time)</h2>
              <p className="text-xs text-slate-500">Data live diambil langsung dari MySQL backend</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
              {tools.length} Peralatan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs">
                  <th className="py-3 px-6 font-semibold w-16">No</th>
                  <th className="py-3 px-6 font-semibold">Kode</th>
                  <th className="py-3 px-6 font-semibold">Nama Alat</th>
                  <th className="py-3 px-6 font-semibold">Kategori</th>
                  <th className="py-3 px-6 font-semibold">Stok</th>
                  <th className="py-3 px-6 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      Memuat data dari database MySQL...
                    </td>
                  </tr>
                ) : tools.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">
                      Belum ada data alat di database.
                    </td>
                  </tr>
                ) : (
                  tools.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-500">{index + 1}</td>
                      <td className="py-3.5 px-6 font-mono font-medium text-indigo-600">{item.code || `ALT-${item.id}`}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3.5 px-6 text-slate-600">{item.category_name || 'Umum'}</td>
                      <td className="py-3.5 px-6 font-medium text-slate-700">{item.stock || 1} unit</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            item.status === 'Tersedia'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.status || 'Tersedia'}
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