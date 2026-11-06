import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function DaftarAlatPeminjam() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [toolsData, catsData] = await Promise.all([
          fetchAPI('/alat'),
          fetchAPI('/kategori').catch(() => []),
        ]);
        setTools(toolsData || []);
        setCategories(catsData || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat katalog alat');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTools = tools.filter((alat) => {
    const matchesSearch =
      alat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alat.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory ? String(alat.category_id) === String(selectedCategory) : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Tool Catalog
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Katalog Alat Tersedia</h1>
            <p className="text-xs text-slate-500 mt-0.5">Daftar inventaris alat dan fasilitas yang dapat dipinjam untuk keperluan belajar</p>
          </div>
          <button
            onClick={() => navigate('/peminjam/ajukan')}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer border border-slate-800 transition-all"
          >
            <span>+</span>
            <span>Form Ajukan Pinjam</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-2xl">
            {error}
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
            <input
              type="text"
              placeholder="Cari nama atau kode alat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 w-full sm:w-72"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-950 text-slate-300 rounded-xl border border-slate-800">
            {filteredTools.length} Alat Tersedia
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Memuat katalog alat dari database...</div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs bg-white rounded-2xl border border-slate-200/90 p-8">
            Tidak ada alat yang cocok dengan filter atau pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((alat) => {
              const isAvailable = alat.status === 'Tersedia' && alat.stock > 0;
              return (
                <div
                  key={alat.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                        {alat.code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isAvailable
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : alat.status === 'Perbaikan'
                            ? 'bg-slate-50 text-slate-700 border-slate-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {alat.stock <= 0 && alat.status === 'Tersedia' ? 'Habis' : alat.status}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-950 text-base group-hover:text-slate-600 transition-colors">
                      {alat.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Kategori: <span className="text-slate-700 font-semibold">{alat.category_name || 'Umum'}</span>
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Stok: </span>
                      <span className="font-black text-slate-950 text-sm">{alat.stock} unit</span>
                    </div>
                    {isAvailable ? (
                      <button
                        onClick={() => navigate(`/peminjam/ajukan?tool_id=${alat.id}`)}
                        className="px-3.5 py-2 bg-slate-950 hover:bg-slate-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer border border-slate-800"
                      >
                        Pinjam Alat
                      </button>
                    ) : (
                      <span className="text-slate-400 font-medium">Tidak Tersedia</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
