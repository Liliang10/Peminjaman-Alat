import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function AjukanPeminjaman() {
  const [tools, setTools] = useState([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedToolId = searchParams.get('tool_id');

  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultReturn = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    tool_id: preselectedToolId || '',
    loan_date: todayStr,
    return_date: defaultReturn,
    reason: '',
  });

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchAPI('/alat');
        // Filter to available tools with stock > 0
        const available = (data || []).filter((t) => t.status === 'Tersedia' && t.stock > 0);
        setTools(available);
        if (available.length > 0 && !formData.tool_id) {
          const matched = preselectedToolId
            ? available.find((t) => String(t.id) === String(preselectedToolId))
            : null;
          setFormData((prev) => ({
            ...prev,
            tool_id: matched ? matched.id : available[0].id,
          }));
        }
      } catch (err) {
        setError('Gagal memuat katalog alat: ' + err.message);
      } finally {
        setLoadingTools(false);
      }
    };
    loadTools();
  }, [preselectedToolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (new Date(formData.return_date) < new Date(formData.loan_date)) {
      setError('Tanggal pengembalian tidak boleh sebelum tanggal peminjaman!');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetchAPI('/peminjaman/ajukan', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSuccess(res.message || 'Pengajuan peminjaman berhasil dikirim!');
      setTimeout(() => {
        navigate('/peminjam/peminjaman-saya');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Gagal mengirim pengajuan peminjaman');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
            Request Form
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Formulir Pengajuan Peminjaman</h1>
          <p className="text-xs text-slate-500 mt-0.5">Lengkapi formulir untuk mengajukan permohonan peminjaman alat ke petugas</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl max-w-xl flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-slate-500 hover:text-slate-700 font-bold">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl max-w-xl">
            {success}
          </div>
        )}

        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Pilih Alat Tersedia</label>
              {loadingTools ? (
                <div className="text-xs text-slate-400 py-2">Memuat daftar alat yang tersedia...</div>
              ) : tools.length === 0 ? (
                <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  Saat ini tidak ada alat yang memiliki stok tersedia untuk dipinjam.
                </div>
              ) : (
                <select
                  value={formData.tool_id}
                  onChange={(e) => setFormData({ ...formData, tool_id: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600/20"
                  required
                >
                  {tools.map((alat) => (
                    <option key={alat.id} value={alat.id}>
                      {alat.code} - {alat.name} ({alat.category_name || 'Alat'}, Stok: {alat.stock} unit)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tanggal Pinjam</label>
                <input
                  type="date"
                  required
                  value={formData.loan_date}
                  onChange={(e) => setFormData({ ...formData, loan_date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tanggal Pengembalian</label>
                <input
                  type="date"
                  required
                  value={formData.return_date}
                  onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Keperluan / Alasan Peminjaman</label>
              <textarea
                rows="3"
                required
                value={formData.reason}
                placeholder="Contoh: Praktik ujian kejuruan multimedia / liputan kegiatan OSIS..."
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || loadingTools || tools.length === 0}
              className="w-full py-3 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer border border-slate-800 mt-2"
            >
              {submitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Peminjaman'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
