import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
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
      { name: 'Persetujuan Peminjaman', path: '/petugas/peminjaman', icon: '📑' },
      { name: 'Proses Pengembalian', path: '/petugas/pengembalian', icon: '↩️' },
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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar-shell bg-slate-950 text-slate-300 border-r border-slate-800/80 h-screen sticky top-0 flex flex-col justify-between shadow-2xl select-none flex-shrink-0 z-20">
      {/* Bagian Atas: Logo & List Menu */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-6 flex-shrink-0">
          <div className="sidebar-brand flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-slate-600/30">
              📦
            </div>
            <div className="sidebar-expanded-content">
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">
                Peminjaman Alat
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">Smart Inventory System</p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="sidebar-profile mt-4 p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-inner">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white truncate">{user?.name || 'Pengguna'}</span>
              <span
                className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-md border bg-slate-800 text-slate-200 border-slate-700"
              >
                {currentRole}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || '-'}</div>
          </div>
        </div>

        {/* Navigasi Menu */}
        <div className="sidebar-expanded-content text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-1">
          Menu Navigasi
        </div>
        <nav className="space-y-1 overflow-y-auto pr-1 flex-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                title={item.name}
                aria-label={item.name}
                className={`sidebar-nav-button w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-950 font-bold shadow-lg shadow-black/20 border border-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span className="sidebar-icon text-sm">{item.icon}</span>
                <span className="sidebar-expanded-content sidebar-label tracking-wide">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bagian Bawah: Tombol Logout Murni */}
      <div className="border-t border-slate-800/80 pt-3 mt-3 flex-shrink-0">
        <button
          onClick={handleLogout}
          title="Keluar (Logout)"
          aria-label="Keluar (Logout)"
          className="sidebar-nav-button w-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-xl px-3 py-2.5 transition-all flex items-center gap-2.5 text-left cursor-pointer"
        >
          <span className="sidebar-icon text-sm">🚪</span>
          <span className="sidebar-expanded-content sidebar-label">Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
