import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAPI } from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.user, data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Gagal melakukan login!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100 w-full max-w-md">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-md shadow-indigo-200 mb-3">
            📦
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Peminjaman Alat</h2>
          <p className="text-sm text-slate-500 mt-1">Masuk untuk mengelola dan meminjam peralatan</p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            ⚡ Quick Fill Akun Demo:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@aplikasi.com', '123456')}
              className="py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-sm"
            >
              👑 Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('petugas@aplikasi.com', '123456')}
              className="py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-sm"
            >
              📋 Petugas
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('peminjam@aplikasi.com', '123456')}
              className="py-1.5 px-2 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-sm"
            >
              🎒 Peminjam
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <span className="text-sm">⚠️</span>
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@aplikasi.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-md shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Memproses Masuk...</span>
              </>
            ) : (
              'Masuk Sekarang'
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}