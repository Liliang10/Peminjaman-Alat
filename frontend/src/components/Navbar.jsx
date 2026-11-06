import { useAuth } from '../context/AuthContext';

export default function Navbar({ title = 'Dashboard' }) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}