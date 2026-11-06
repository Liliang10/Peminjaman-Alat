import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function ManajemenUser() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/users');
      setUserList(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
            <p className="text-xs text-slate-500 mt-0.5">Daftar akun pengguna terdaftar di database</p>
          </div>
          <button
            onClick={loadUsers}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl shadow-xs"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs">
                <th className="py-3 px-6 font-semibold">No</th>
                <th className="py-3 px-6 font-semibold">Nama Lengkap</th>
                <th className="py-3 px-6 font-semibold">Email</th>
                <th className="py-3 px-6 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : userList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                userList.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-50/80">
                    <td className="py-3.5 px-6 font-medium text-slate-500">{index + 1}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-6 text-slate-600">{item.email}</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`capitalize px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          item.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : item.role === 'petugas'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.role}
                      </span>
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