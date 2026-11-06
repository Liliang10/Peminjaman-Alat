import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { fetchAPI } from '../../utils/api';

export default function LogAktivitas() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAPI('/logs');
      setLogs(data || []);
    } catch (err) {
      setError(err.message || 'Gagal memuat log aktivitas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user_role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-slate-950/70 text-slate-300 border-slate-800';
      case 'petugas':
        return 'bg-slate-950/70 text-slate-300 border-slate-800';
      default:
        return 'bg-slate-950/70 text-slate-300 border-slate-800';
    }
  };

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-bold tracking-wider uppercase mb-1.5 border border-slate-800">
              Audit Logs
            </div>
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">Log Aktivitas Sistem</h1>
            <p className="text-xs text-slate-500 mt-0.5">Catatan riwayat tindakan pengguna terekam secara otomatis</p>
          </div>
          <button
            onClick={loadLogs}
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

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="Cari aktivitas atau nama pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-slate-600 w-full sm:w-80"
          />
          <span className="text-xs font-bold px-3 py-1 bg-slate-950 text-slate-300 rounded-xl border border-slate-800">
            Total Aktivitas: {filteredLogs.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs">Memuat log aktivitas...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">Belum ada catatan aktivitas di sistem.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <li key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-950 text-slate-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-slate-800 shadow-xs">
                      ⚡
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-950">
                          {log.user_name || 'Sistem'}
                        </span>
                        {log.user_role && (
                          <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${getRoleBadge(log.user_role)}`}>
                            {log.user_role}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 font-medium mt-0.5">{log.action}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap pl-12 sm:pl-0">
                    {log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
