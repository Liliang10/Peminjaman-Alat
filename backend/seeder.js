import db from './config/db.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Seeder...');

    // Hash Password default "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // 1. Seed Users
    await db.query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Admin Utama', 'admin@aplikasi.com', '${hashedPassword}', 'admin'),
      ('Petugas Lapangan', 'petugas@aplikasi.com', '${hashedPassword}', 'petugas'),
      ('Peminjam Alat', 'peminjam@aplikasi.com', '${hashedPassword}', 'peminjam')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);
    console.log('✅ Users Seeded!');

    // 2. Seed Categories
    await db.query(`
      INSERT INTO categories (id, name) VALUES 
      (1, 'Elektronik'),
      (2, 'Fasilitas'),
      (3, 'Audio'),
      (4, 'Aksesoris')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);
    console.log('✅ Categories Seeded!');

    // 3. Seed Tools
    await db.query(`
      INSERT INTO tools (code, name, category_id, stock, status) VALUES 
      ('ALT-001', 'Kamera Canon EOS', 1, 5, 'Tersedia'),
      ('ALT-002', 'Proyektor Epson', 2, 2, 'Dipinjam'),
      ('ALT-003', 'Microphone Wireless', 3, 8, 'Tersedia'),
      ('ALT-004', 'Tripod Kamera', 4, 3, 'Tersedia')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);
    console.log('✅ Tools Seeded!');

    console.log('🚀 Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();