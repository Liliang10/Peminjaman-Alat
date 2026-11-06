import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function ManajemenKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadKategori = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/kategori');
      setKategoriList(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKategori();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSubmitting(true);
    try {
      await fetchAPI('/kategori', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName }),
      });
      setNewCategoryName('');
      await loadKategori();
    } catch (err) {
      alert('Gagal menambah kategori: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Kategori</h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola kategori barang dan peralatan di sistem</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Tambah */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs h-fit">
            <h2 className="text-sm font-bold text-slate-800 mb-3">+ Tambah Kategori Baru</h2>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Multimedia"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Kategori'}
              </button>
            </form>
          </div>

          {/* Table Kategori */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs">
                  <th className="py-3 px-6 font-semibold">No</th>
                  <th className="py-3 px-6 font-semibold">Nama Kategori</th>
                  <th className="py-3 px-6 font-semibold">Total Alat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-400">
                      Memuat data kategori...
                    </td>
                  </tr>
                ) : (
                  kategoriList.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-6 font-medium text-slate-500">{index + 1}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-3.5 px-6 text-slate-600">{item.total_tools || 0} unit</td>
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