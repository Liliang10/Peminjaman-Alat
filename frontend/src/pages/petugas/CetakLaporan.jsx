import Sidebar from '../../components/Sidebar';

export default function CetakLaporan() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cetak Laporan Peminjaman</h1>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-xl">
          <p className="text-xs text-gray-500 mb-4">Pilih periode laporan yang ingin dicetak atau diunduh:</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Mulai</label>
              <input type="date" className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tanggal Selesai</label>
              <input type="date" className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm" />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => window.print()} 
                className="flex-1 py-2 bg-black text-white rounded text-xs font-medium hover:bg-gray-800"
              >
                Cetak PDF / Print
              </button>
              <button 
                className="flex-1 py-2 border border-black rounded text-xs font-medium hover:bg-gray-50"
              >
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}