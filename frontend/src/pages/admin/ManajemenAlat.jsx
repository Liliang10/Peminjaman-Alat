import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function ManajemenAlat() {
  const [alatList, setAlatList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category_id: '',
    stock: 1,
    status: 'Tersedia',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tools, categories] = await Promise.all([
        fetchAPI('/alat'),
        fetchAPI('/kategori').catch(() => []),
      ]);
      setAlatList(tools || []);
      setKategoriList(categories || []);
      if (categories && categories.length > 0 && !formData.category_id) {
        setFormData((prev) => ({ ...prev, category_id: categories[0].id }));
      }
    } catch (err) {
      setError(err.message || 'Gagal mengambil data alat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTool = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await fetchAPI('/alat', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowModal(false);
      setFormData({
        code: '',
        name: '',
        category_id: kategoriList[0]?.id || '',
        stock: 1,
        status: 'Tersedia',
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menambahkan alat');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTool = async (id) => {
    if (!window.confirm('Yakin ingin menghapus alat ini dari database?')) return;
    try {
      await fetchAPI(`/alat/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (err) {
      alert('Gagal menghapus alat: ' + err.message);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Alat</h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola data inventaris peralatan secara real-time</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Tambah Alat Baru</span>
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
                <th className="py-3 px-6 font-semibold">Kode</th>
                <th className="py-3 px-6 font-semibold">Nama Alat</th>
                <th className="py-3 px-6 font-semibold">Kategori</th>
                <th className="py-3 px-6 font-semibold">Stok</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Memuat data alat dari database...
                  </td>
                </tr>
              ) : alatList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Belum ada alat terdaftar.
                  </td>
                </tr>
              ) : (
                alatList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-medium text-indigo-600">{item.code}</td>
                    <td className="py-3.5 px-6 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-6 text-slate-600">{item.category_name || '-'}</td>
                    <td className="py-3.5 px-6 font-medium text-slate-700">{item.stock} unit</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          item.status === 'Tersedia'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDeleteTool(item.id)}
                          className="px-2.5 py-1 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
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

        {/* Modal Tambah Alat */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">Tambah Alat Baru</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTool} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Alat</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    placeholder="Contoh: ALT-005"
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Alat</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    placeholder="Contoh: Lensa Kamera 50mm"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  >
                    {kategoriList.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Unit</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status Awal</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Tersedia">Tersedia</option>
                      <option value="Dipinjam">Dipinjam</option>
                      <option value="Perbaikan">Perbaikan</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Alat'}
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