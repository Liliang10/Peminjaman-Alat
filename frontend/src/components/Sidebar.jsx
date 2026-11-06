import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuByRole = {
    admin: [
      { name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { name: 'Manajemen Alat', path: '/admin/alat', icon: '🔧' },
      { name: 'Manajemen Kategori', path: '/admin/kategori', icon: '📂' },
      { name: 'Manajemen User', path: '/admin/user', icon: '👥' },
      { name: 'Data Peminjaman', path: '/admin/peminjaman', icon: '📑' },
      { name: 'Pengembalian', path: '/admin/pengembalian', icon: '↩️' },
      { name: 'Log Aktivitas', path: '/admin/log', icon: '📜' },
    ],
    petugas: [
      { name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { name: 'Peminjaman', path: '/petugas/peminjaman', icon: '📑' },
      { name: 'Pengembalian', path: '/petugas/pengembalian', icon: '↩️' },
      { name: 'Cetak Laporan', path: '/petugas/laporan', icon: '🖨️' },
    ],
    peminjam: [
      { name: 'Dashboard', path: '/dashboard', icon: '📊' },
      { name: 'Daftar Alat', path: '/peminjam/alat', icon: '🔍' },
      { name: 'Ajukan Peminjaman', path: '/peminjam/ajukan', icon: '➕' },
      { name: 'Peminjaman Saya', path: '/peminjam/peminjaman-saya', icon: '📋' },
    ],
  };

  const currentRole = user?.role || 'peminjam';
  const menuItems = menuByRole[currentRole] || [];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col justify-between p-5 shadow-sm">
      {/* Bagian Atas: Logo & List Menu */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow">
              📦
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">Peminjaman Alat</h2>
              <p className="text-[11px] text-slate-400">SMK / Kampus App</p>
            </div>
          </div>
          <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'Pengguna'}</div>
            <div className="text-[11px] text-slate-500 truncate">{user?.email || '-'}</div>
            <div className="mt-1">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-100 text-indigo-700">
                {currentRole}
              </span>
            </div>
          </div>
        </div>

        {/* Navigasi Menu */}
        <nav className="space-y-1 overflow-y-auto pr-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Switch Role & Logout */}
      <div className="border-t border-slate-200 pt-3 mt-3 space-y-2.5 flex-shrink-0">
        <div>
          <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1.5 tracking-wider">
            ⚡ Ganti Role (Demo)
          </label>
          <div className="grid grid-cols-3 gap-1">
            {['admin', 'petugas', 'peminjam'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  if (typeof switchRole === 'function') {
                    switchRole(r);
                  }
                  navigate('/dashboard');
                }}
                className={`text-[10px] py-1 px-1.5 rounded-lg border text-center capitalize font-medium transition-colors ${
                  currentRole === r
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl px-3 py-2 transition-colors flex items-center gap-2 w-full text-left"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}