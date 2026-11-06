import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function DaftarAlatPeminjam() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTools = async () => {
      try {
        const data = await fetchAPI('/alat');
        setTools(data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat katalog alat');
      } finally {
        setLoading(false);
      }
    };
    loadTools();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Katalog Alat Tersedia</h1>
        <p className="text-xs text-slate-500 mb-6">Daftar inventaris alat dan fasilitas yang dapat dipinjam</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Memuat katalog alat dari database...</div>
        ) : tools.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">Belum ada alat yang tersedia.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((alat) => (
              <div
                key={alat.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {alat.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        alat.status === 'Tersedia'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {alat.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{alat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Kategori: {alat.category_name || 'Umum'}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-600 font-medium">Stok Tersedia:</span>
                  <span className="font-bold text-slate-800">{alat.stock} unit</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}