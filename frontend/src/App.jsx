import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Admin Pages
import ManajemenAlat from './pages/admin/ManajemenAlat';
import ManajemenKategori from './pages/admin/ManajemenKategori';
import ManajemenUser from './pages/admin/ManajemenUser';
import DataPeminjaman from './pages/admin/DataPeminjaman';
import PengembalianAdmin from './pages/admin/PengembalianAdmin';
import LogAktivitas from './pages/admin/LogAktivitas';

// Petugas Pages
import PeminjamanPetugas from './pages/petugas/PeminjamanPetugas';
import PengembalianPetugas from './pages/petugas/PengembalianPetugas';
import CetakLaporan from './pages/petugas/CetakLaporan';

// Peminjam Pages
import DaftarAlatPeminjam from './pages/peminjam/DaftarAlatPeminjam';
import AjukanPeminjaman from './pages/peminjam/AjukanPeminjaman';
import PeminjamanSaya from './pages/peminjam/PeminjamanSaya';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/alat" element={<ProtectedRoute><ManajemenAlat /></ProtectedRoute>} />
          <Route path="/admin/kategori" element={<ProtectedRoute><ManajemenKategori /></ProtectedRoute>} />
          <Route path="/admin/user" element={<ProtectedRoute><ManajemenUser /></ProtectedRoute>} />
          <Route path="/admin/peminjaman" element={<ProtectedRoute><DataPeminjaman /></ProtectedRoute>} />
          <Route path="/admin/pengembalian" element={<ProtectedRoute><PengembalianAdmin /></ProtectedRoute>} />
          <Route path="/admin/log" element={<ProtectedRoute><LogAktivitas /></ProtectedRoute>} />

          {/* Petugas Routes */}
          <Route path="/petugas/peminjaman" element={<ProtectedRoute><PeminjamanPetugas /></ProtectedRoute>} />
          <Route path="/petugas/pengembalian" element={<ProtectedRoute><PengembalianPetugas /></ProtectedRoute>} />
          <Route path="/petugas/laporan" element={<ProtectedRoute><CetakLaporan /></ProtectedRoute>} />

          {/* Peminjam Routes */}
          <Route path="/peminjam/alat" element={<ProtectedRoute><DaftarAlatPeminjam /></ProtectedRoute>} />
          <Route path="/peminjam/ajukan" element={<ProtectedRoute><AjukanPeminjaman /></ProtectedRoute>} />
          <Route path="/peminjam/peminjaman-saya" element={<ProtectedRoute><PeminjamanSaya /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}