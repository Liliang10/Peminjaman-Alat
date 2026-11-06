import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function ManajemenKategori() {
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState({ id: null, name: '' });
  const [updating, setUpdating] = useState(false);

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
    setError('');
    try {
      await fetchAPI('/kategori', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      setNewCategoryName('');
      setSuccess('Kategori baru berhasil ditambahkan!');
      setTimeout(() => setSuccess(''), 3000);
      await loadKategori();
    } catch (err) {
      setError(err.message || 'Gagal menambah kategori');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (kat) => {
    setEditingCategory({ id: kat.id, name: kat.name });
    setError('');
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;
    setUpdating(true);
    setError('');
    try {
      await fetchAPI(`/kategori/${editingCategory.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editingCategory.name.trim() }),
      });
      setEditModalOpen(false);
      setSuccess('Kategori berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 3000);
      await loadKategori();
    } catch (err) {
      setError(err.message || 'Gagal memperbarui kategori');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus kategori "${name}"?`)) return;
    try {
      await fetchAPI(`/kategori/${id}`, { method: 'DELETE' });
      setSuccess(`Kategori "${name}" berhasil dihapus!`);
      setTimeout(() => setSuccess(''), 3000);
      await loadKategori();
    } catch (err) {
      alert(err.message || 'Gagal menghapus kategori');
    }
  };

  const filteredCategories = kategoriList.filter((k) =>
    k.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Taxonomy
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Manajemen Kategori</h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola kategori pengelompokan peralatan</p>
          </div>
          <button
            onClick={loadKategori}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            🔄 Segarkan
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-slate-500 hover:text-slate-700 font-bold">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-slate-500 hover:text-slate-700 font-bold">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Tambah Kategori */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs h-fit">
            <h2 className="text-sm font-extrabold text-slate-950 mb-3.5">+ Tambah Kategori Baru</h2>
            <form onSubmit={handleAddCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Multimedia & Studio"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer tracking-wide"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Kategori'}
              </button>
            </form>
          </div>

          {/* Table List Kategori */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 w-64"
              />
              <span className="text-xs font-bold px-3 py-1 bg-slate-950 text-slate-300 rounded-xl border border-slate-800">
                {filteredCategories.length} Kategori
              </span>
            </div>

            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                  <th className="py-3 px-6 w-16">No</th>
                  <th className="py-3 px-6">Nama Kategori</th>
                  <th className="py-3 px-6">Total Alat</th>
                  <th className="py-3 px-6 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      Memuat data kategori...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-400">
                      Belum ada data kategori.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-6 font-semibold text-slate-700">{item.total_tools || 0} unit</td>
                      <td className="py-3.5 px-6 text-center">
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => openEdit(item)}
                            className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(item.id, item.name)}
                            className="px-2.5 py-1 bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Edit Kategori */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-950">Edit Nama Kategori</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
