import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function ManajemenAlat() {
  const [alatList, setAlatList] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
      setError(err.message || 'Gagal mengambil data inventaris alat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setFormData({
      code: '',
      name: '',
      category_id: kategoriList[0]?.id || '',
      stock: 1,
      status: 'Tersedia',
    });
    setError('');
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      code: item.code || '',
      name: item.name || '',
      category_id: item.category_id || kategoriList[0]?.id || '',
      stock: item.stock !== undefined ? item.stock : 1,
      status: item.status || 'Tersedia',
    });
    setError('');
    setShowEditModal(true);
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await fetchAPI('/alat', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setShowAddModal(false);
      setSuccess('Alat baru berhasil ditambahkan!');
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menambahkan alat baru');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTool = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await fetchAPI(`/alat/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setShowEditModal(false);
      setSuccess('Data alat berhasil diperbarui!');
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal memperbarui data alat');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTool = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus alat "${name}"?`)) return;
    try {
      await fetchAPI(`/alat/${id}`, { method: 'DELETE' });
      setSuccess(`Alat "${name}" berhasil dihapus!`);
      setTimeout(() => setSuccess(''), 3000);
      await loadData();
    } catch (err) {
      alert('Gagal menghapus alat: ' + err.message);
    }
  };

  const filteredList = alatList.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? String(item.category_id) === String(filterCategory) : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Inventory Control
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Manajemen Alat</h1>
            <p className="text-xs text-slate-500 mt-0.5">Kelola seluruh data inventaris dan peralatan</p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-slate-800 hover:border-slate-600"
          >
            <span>+</span>
            <span>Tambah Alat Baru</span>
          </button>
        </div>

        {/* Alerts */}
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

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
            <input
              type="text"
              placeholder="Cari kode atau nama alat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 w-full sm:w-72"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map((kat) => (
                <option key={kat.id} value={kat.id}>
                  {kat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={loadData}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-colors"
          >
            🔄 Segarkan
          </button>
        </div>

        {/* Table Alat */}
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 text-slate-200 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3 px-6 w-16">No</th>
                <th className="py-3 px-6">Kode Alat</th>
                <th className="py-3 px-6 min-w-[14rem]">Nama Alat</th>
                <th className="py-3 px-6">Kategori</th>
                <th className="py-3 px-6">Stok</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Memuat data alat...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    Tidak ada alat ditemukan.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-400">{index + 1}</td>
                    <td className="py-3.5 px-6">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-6 text-slate-600">{item.category_name || '-'}</td>
                    <td className="py-3.5 px-6 font-bold text-slate-800">{item.stock} unit</td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          item.status === 'Tersedia' && item.stock > 0
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : item.status === 'Perbaikan'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.stock <= 0 && item.status === 'Tersedia' ? 'Habis' : item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTool(item.id, item.name)}
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

        {/* Modal Tambah Alat */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-950">Tambah Alat Baru</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTool} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kode Alat</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    placeholder="Contoh: ALT-014"
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Alat</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    placeholder="Contoh: Sony Alpha A7 III"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
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
                    <label className="block text-xs font-bold text-slate-800 mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Status Alat</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
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
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Alat'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Alat */}
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-950">Edit Data Alat</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditTool} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kode Alat</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nama Alat</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
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
                    <label className="block text-xs font-bold text-slate-800 mb-1">Jumlah Stok</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Status Alat</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
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
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
