import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db.js';

import authRoutes from './routes/authRoutes.js';
import alatRoutes from './routes/alatRoutes.js';
import kategoriRoutes from './routes/kategoriRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pinjamRoutes from './routes/pinjamRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Opsi CORS Longgar untuk Development
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alat', alatRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/users', userRoutes);
app.use('/api/peminjaman', pinjamRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Peminjaman Alat App Running...' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});