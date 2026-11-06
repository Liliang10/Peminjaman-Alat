import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAPI } from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'peminjam',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal harus 6 karakter!');
      return;
    }

    setLoading(true);

    try {
      const data = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      setSuccess(data.message || 'Registrasi berhasil! Mengalihkan ke login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Gagal mendaftar akun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle Futuristic Glow Backdrop */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-slate-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-slate-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-950/40 relative z-10">
        {/* Header Branding with proper vertical flex stacking and clean spacing */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-slate-600/30 mb-4 flex-shrink-0">
            📝
          </div>
          <div className="px-3.5 py-1 bg-slate-950 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-800 mb-3.5 shadow-xs">
            Pendaftaran Pengguna
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
            Buat akun untuk mengajukan peminjaman fasilitas & alat
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl flex items-start gap-2">
            <span>⚠️</span>
            <div className="flex-1 font-medium">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl flex items-start gap-2">
            <span>✅</span>
            <div className="flex-1 font-medium">{success}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600/15 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Alamat Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600/15 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Role Akun</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600/15 transition-all"
            >
              <option value="peminjam">Peminjam (Siswa / Guru)</option>
              <option value="petugas">Petugas Lapangan</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Kata Sandi</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600/15 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Konfirmasi Kata Sandi</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Ulangi kata sandi"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 focus:ring-2 focus:ring-slate-600/15 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-slate-600/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-3 tracking-wide"
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-slate-600 hover:text-slate-800 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
