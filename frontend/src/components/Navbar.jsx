import { useAuth } from '../context/AuthContext';

export default function Navbar({ title = 'Dashboard' }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-700">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
