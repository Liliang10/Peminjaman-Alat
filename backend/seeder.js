import db from './config/db.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting Comprehensive Seeder...');

    // Hash Password default "123456"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // 1. Seed Categories
    await db.query(`
      INSERT INTO categories (id, name) VALUES 
      (1, 'Kamera & Fotografi'),
      (2, 'Audio & Akustik'),
      (3, 'Proyektor & Presentasi'),
      (4, 'Komputer & Jaringan'),
      (5, 'Studio & Tata Cahaya'),
      (6, 'Aksesoris & Kabel')
      ON DUPLICATE KEY UPDATE name=VALUES(name);
    `);
    console.log('✅ Categories Seeded!');

    // 2. Seed Users
    await db.query(`
      INSERT INTO users (id, name, email, password, role) VALUES 
      (1, 'Admin Utama', 'admin@aplikasi.com', '${hashedPassword}', 'admin'),
      (2, 'Petugas Lapangan', 'petugas@aplikasi.com', '${hashedPassword}', 'petugas'),
      (3, 'Peminjam Alat', 'peminjam@aplikasi.com', '${hashedPassword}', 'peminjam'),
      (4, 'Budi Santoso (Admin Lab)', 'budi.admin@aplikasi.com', '${hashedPassword}', 'admin'),
      (5, 'Siti Rahmawati (Petugas)', 'siti.petugas@aplikasi.com', '${hashedPassword}', 'petugas'),
      (6, 'Ahmad Fauzi (Siswa XI RPL)', 'fauzi@siswa.smk.id', '${hashedPassword}', 'peminjam'),
      (7, 'Dewi Lestari (Guru Multimedia)', 'dewi@guru.smk.id', '${hashedPassword}', 'peminjam'),
      (8, 'Rian Pratama (Siswa XII DKV)', 'rian@siswa.smk.id', '${hashedPassword}', 'peminjam')
      ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), password=VALUES(password);
    `);
    console.log('✅ Users Seeded!');

    // 3. Seed Tools
    await db.query(`
      INSERT INTO tools (id, code, name, category_id, stock, status) VALUES 
      (1, 'ALT-001', 'Kamera DSLR Canon EOS 80D', 1, 4, 'Tersedia'),
      (2, 'ALT-002', 'Sony Mirrorless Alpha 7 III', 1, 2, 'Tersedia'),
      (3, 'ALT-003', 'Lensa Fix Sony FE 50mm f/1.8', 1, 3, 'Tersedia'),
      (4, 'ALT-004', 'Microphone Wireless Rode GO II', 2, 5, 'Tersedia'),
      (5, 'ALT-005', 'Clip-On Mic Boya BY-M1 Pro', 2, 8, 'Tersedia'),
      (6, 'ALT-006', 'Proyektor Epson EB-X500 XGA', 3, 2, 'Dipinjam'),
      (7, 'ALT-007', 'Layar Proyektor Tripod 70 Inch', 3, 3, 'Tersedia'),
      (8, 'ALT-008', 'Switch Hub Gigabit TP-Link 16-Port', 4, 4, 'Tersedia'),
      (9, 'ALT-009', 'Crimping Tool & LAN Cable Tester', 4, 6, 'Tersedia'),
      (10, 'ALT-010', 'Ring Light LED Godox 18 Inch', 5, 3, 'Tersedia'),
      (11, 'ALT-011', 'Softbox Studio Lighting Kit 50x70', 5, 2, 'Tersedia'),
      (12, 'ALT-012', 'Tripod Takara Hydro Pro Heavy Duty', 6, 5, 'Tersedia'),
      (13, 'ALT-013', 'Kabel Roll HDMI 2.0 Ultra HD 20m', 6, 6, 'Tersedia')
      ON DUPLICATE KEY UPDATE name=VALUES(name), category_id=VALUES(category_id), stock=VALUES(stock), status=VALUES(status);
    `);
    console.log('✅ Tools Seeded!');

    // 4. Seed Loans (Peminjaman)
    await db.query(`DELETE FROM loans`);
    await db.query(`
      INSERT INTO loans (id, user_id, tool_id, loan_date, return_date, actual_return_date, reason, status) VALUES 
      (1, 6, 1, '2026-11-04', '2026-11-08', NULL, 'Praktik tugas fotografi outdoor mata pelajaran Desain Grafis', 'Disetujui'),
      (2, 7, 6, '2026-11-05', '2026-11-07', NULL, 'Presentasi pembelajaran multimedia interaktif di Aula Gedung Utama', 'Dipinjam'),
      (3, 8, 4, '2026-11-07', '2026-11-09', NULL, 'Rekaman podcast OSIS dan wawancara inspiratif kepala sekolah', 'Menunggu'),
      (4, 3, 10, '2026-11-06', '2026-11-08', NULL, 'Sesi pemotretan pas foto pengurus OSIS dan majalah dinding sekolah', 'Menunggu'),
      (5, 6, 5, '2026-11-01', '2026-11-03', '2026-11-03', 'Praktik wawancara jurnalisme dan siaran radio sekolah', 'Selesai'),
      (6, 8, 12, '2026-11-02', '2026-11-04', '2026-11-04', 'Dokumentasi kegiatan upacara bendera dan pelantikan ekskul', 'Selesai'),
      (7, 7, 2, '2026-10-28', '2026-10-30', NULL, 'Permohonan kegiatan di luar jam operasional resmi sekolah', 'Ditolak');
    `);
    console.log('✅ Loans Seeded!');

    // 5. Seed Activity Logs
    await db.query(`DELETE FROM activity_logs`);
    await db.query(`
      INSERT INTO activity_logs (user_id, action, created_at) VALUES 
      (1, 'Inisialisasi sistem dan konfigurasi inventaris awal', NOW() - INTERVAL 5 DAY),
      (1, 'Menambahkan alat baru: Kamera DSLR Canon EOS 80D', NOW() - INTERVAL 5 DAY),
      (4, 'Menambahkan kategori baru: Studio & Tata Cahaya', NOW() - INTERVAL 4 DAY),
      (6, 'Mengajukan peminjaman: Clip-On Mic Boya BY-M1 Pro', NOW() - INTERVAL 4 DAY),
      (2, 'Menyetujui peminjaman ID #5 (Clip-On Mic Boya BY-M1 Pro)', NOW() - INTERVAL 4 DAY),
      (2, 'Mengonfirmasi pengembalian alat ID #5 (Status: Selesai)', NOW() - INTERVAL 2 DAY),
      (7, 'Mengajukan peminjaman: Proyektor Epson EB-X500 XGA', NOW() - INTERVAL 1 DAY),
      (2, 'Mengubah status pinjaman ID #2 menjadi "Dipinjam"', NOW() - INTERVAL 1 DAY),
      (8, 'Mengajukan peminjaman: Microphone Wireless Rode GO II', NOW() - INTERVAL 4 HOUR),
      (3, 'Mengajukan peminjaman: Ring Light LED Godox 18 Inch', NOW() - INTERVAL 2 HOUR);
    `);
    console.log('✅ Activity Logs Seeded!');

    console.log('🚀 Comprehensive Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
