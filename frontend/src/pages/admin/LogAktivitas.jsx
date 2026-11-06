import Sidebar from '../../components/Sidebar';

export default function LogAktivitas() {
  const logs = [
    { id: 1, user: 'Admin Utama', aktivitas: 'Menambahkan alat baru: Kamera Canon EOS', waktu: '10 Menit lalu' },
    { id: 2, user: 'Siti Rahma', aktivitas: 'Menyetujui peminjaman ID #204', waktu: '1 Jam lalu' },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Log Aktivitas Sistem</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <ul className="divide-y divide-gray-200">
            {logs.map((log) => (
              <li key={log.id} className="py-3 flex justify-between text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{log.user}: </span>
                  <span className="text-gray-600">{log.aktivitas}</span>
                </div>
                <span className="text-xs text-gray-400">{log.waktu}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}