import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'peminjaman_alat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Tes Koneksi Database
try {
  const connection = await db.getConnection();
  console.log('✅ Connected to MySQL Database!');
  connection.release();
} catch (err) {
  console.error('❌ Database Connection Error:', err.message);
}

export default db;