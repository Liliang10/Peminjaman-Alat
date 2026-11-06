import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function AjukanPeminjaman() {
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tool_id: '',
    loan_date: '',
    return_date: '',
    reason: '',
  });

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchAPI('/alat');
        // Filter to available tools
        const available = (data || []).filter((t) => t.status === 'Tersedia' || t.stock > 0);
        setTools(available);
        if (available.length > 0) {
          setFormData((prev) => ({ ...prev, tool_id: available[0].id }));
        }
      } catch (err) {
        setError('Gagal memuat katalog alat: ' + err.message);
      } finally {
        setLoadingTools(false);
      }
    };
    loadTools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await fetchAPI('/peminjaman/ajukan', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSuccess(res.message || 'Pengajuan peminjaman berhasil dikirim!');
      setTimeout(() => {
        navigate('/peminjam/peminjaman-saya');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengajuan peminjaman');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Form Ajukan Peminjaman</h1>
        <p className="text-xs text-slate-500 mb-6">Ajukan peminjaman alat ke petugas dan inventaris</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl max-w-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl max-w-xl">
            {success}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Alat Tersedia</label>
              {loadingTools ? (
                <div className="text-xs text-slate-400 py-2">Memuat daftar alat...</div>
              ) : (
                <select
                  value={formData.tool_id}
                  onChange={(e) => setFormData({ ...formData, tool_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  {tools.map((alat) => (
                    <option key={alat.id} value={alat.id}>
                      {alat.code} - {alat.name} ({alat.category_name || 'Alat'}, Stok: {alat.stock})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Pinjam</label>
                <input
                  type="date"
                  required
                  value={formData.loan_date}
                  onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tanggal Pengembalian</label>
                <input
                  type="date"
                  required
                  value={formData.return_date}
                  onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Keperluan / Alasan Peminjaman</label>
              <textarea
                rows="3"
                required
                value={formData.reason}
                placeholder="Contoh: Praktik ujian kejuruan broadcasting..."
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || loadingTools}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Peminjaman'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}