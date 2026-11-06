import db from '../config/db.js';
import { logActivity } from '../utils/logger.js';

export const ajukanPeminjaman = async (req, res) => {
  const { tool_id, loan_date, return_date, reason } = req.body;
  const user_id = req.user.id;

  if (!tool_id || !loan_date || !return_date) {
    return res.status(400).json({ message: 'Alat, tanggal pinjam, dan tanggal pengembalian wajib diisi!' });
  }

  try {
    // Cek ketersediaan alat
    const [tools] = await db.query('SELECT id, name, stock, status FROM tools WHERE id = ?', [tool_id]);
    if (tools.length === 0) {
      return res.status(404).json({ message: 'Alat tidak ditemukan!' });
    }

    if (tools[0].stock <= 0) {
      return res.status(400).json({ message: `Stok alat "${tools[0].name}" saat ini habis!` });
    }

    const [result] = await db.query(
      'INSERT INTO loans (user_id, tool_id, loan_date, return_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, tool_id, loan_date, return_date, reason || '', 'Menunggu']
    );

    await logActivity(user_id, `Mengajukan peminjaman: ${tools[0].name}`);
    res.status(201).json({ message: 'Pengajuan peminjaman berhasil dikirim!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllPeminjaman = async (req, res) => {
  try {
    let query = `
      SELECT 
        loans.*, 
        users.name AS user_name, 
        users.email AS user_email,
        users.role AS user_role,
        tools.name AS tool_name,
        tools.code AS tool_code,
        categories.name AS category_name
      FROM loans 
      JOIN users ON loans.user_id = users.id 
      JOIN tools ON loans.tool_id = tools.id
      LEFT JOIN categories ON tools.category_id = categories.id
    `;
    const params = [];

    if (req.user && req.user.role === 'peminjam') {
      query += ` WHERE loans.user_id = ? `;
      params.push(req.user.id);
    }

    query += ` ORDER BY loans.id DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateStatusPeminjaman = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Menunggu', 'Disetujui', 'Ditolak', 'Dipinjam', 'Selesai', 'Terlambat'

  const validStatuses = ['Menunggu', 'Disetujui', 'Ditolak', 'Dipinjam', 'Selesai', 'Terlambat'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status tidak valid: ${status}` });
  }

  try {
    // Ambil data pinjaman saat ini
    const [loans] = await db.query(
      'SELECT loans.*, tools.name as tool_name, tools.stock FROM loans JOIN tools ON loans.tool_id = tools.id WHERE loans.id = ?',
      [id]
    );

    if (loans.length === 0) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan!' });
    }

    const loan = loans[0];
    const prevStatus = loan.status;

    // Logika penyesuaian stok alat
    // Jika berubah menjadi Disetujui atau Dipinjam dari status non-aktif (Menunggu / Ditolak)
    if (
      (status === 'Disetujui' || status === 'Dipinjam') &&
      (prevStatus === 'Menunggu' || prevStatus === 'Ditolak')
    ) {
      await db.query(
        "UPDATE tools SET stock = GREATEST(stock - 1, 0), status = CASE WHEN stock - 1 <= 0 THEN 'Dipinjam' ELSE status END WHERE id = ?",
        [loan.tool_id]
      );
    }
    // Jika dikembalikan (Selesai) dari Disetujui/Dipinjam
    else if (
      status === 'Selesai' &&
      (prevStatus === 'Disetujui' || prevStatus === 'Dipinjam' || prevStatus === 'Terlambat')
    ) {
      await db.query(
        "UPDATE tools SET stock = stock + 1, status = 'Tersedia' WHERE id = ?",
        [loan.tool_id]
      );
    }
    // Jika ditolak setelah sebelumnya sempat disetujui
    else if (
      status === 'Ditolak' &&
      (prevStatus === 'Disetujui' || prevStatus === 'Dipinjam')
    ) {
      await db.query(
        "UPDATE tools SET stock = stock + 1, status = 'Tersedia' WHERE id = ?",
        [loan.tool_id]
      );
    }

    if (status === 'Selesai') {
      await db.query('UPDATE loans SET status=?, actual_return_date=CURDATE() WHERE id=?', [status, id]);
    } else {
      await db.query('UPDATE loans SET status=? WHERE id=?', [status, id]);
    }

    await logActivity(
      req.user?.id,
      `Mengubah status pinjaman ID #${id} (${loan.tool_name}) menjadi "${status}"`
    );

    res.json({ message: `Status peminjaman berhasil diperbarui menjadi ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deletePeminjaman = async (req, res) => {
  const { id } = req.params;

  try {
    const [loans] = await db.query('SELECT * FROM loans WHERE id = ?', [id]);
    if (loans.length === 0) {
      return res.status(404).json({ message: 'Data peminjaman tidak ditemukan!' });
    }

    const loan = loans[0];

    // Peminjam hanya boleh membatalkan pengajuan miliknya yang masih berstatus 'Menunggu'
    if (req.user.role === 'peminjam') {
      if (loan.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Akses ditolak!' });
      }
      if (loan.status !== 'Menunggu') {
        return res.status(400).json({ message: 'Hanya pengajuan dengan status "Menunggu" yang dapat dibatalkan!' });
      }
    }

    // Jika pinjaman yang dihapus berstatus 'Disetujui' atau 'Dipinjam', kembalikan stok alat
    if (loan.status === 'Disetujui' || loan.status === 'Dipinjam') {
      await db.query(
        "UPDATE tools SET stock = stock + 1, status = 'Tersedia' WHERE id = ?",
        [loan.tool_id]
      );
    }

    await db.query('DELETE FROM loans WHERE id = ?', [id]);
    await logActivity(req.user?.id, `Menghapus / membatalkan data pinjaman ID #${id}`);

    res.json({ message: 'Data peminjaman berhasil dihapus / dibatalkan!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
