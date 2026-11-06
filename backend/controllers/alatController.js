import db from '../config/db.js';
import { logActivity } from '../utils/logger.js';

export const getAllAlat = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT tools.*, categories.name AS category_name 
      FROM tools 
      LEFT JOIN categories ON tools.category_id = categories.id
      ORDER BY tools.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createAlat = async (req, res) => {
  const { code, name, category_id, stock, status } = req.body;
  if (!code || !name) {
    return res.status(400).json({ message: 'Kode alat dan nama alat wajib diisi!' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM tools WHERE code = ?', [code]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Kode alat "${code}" sudah digunakan!` });
    }

    const [result] = await db.query(
      'INSERT INTO tools (code, name, category_id, stock, status) VALUES (?, ?, ?, ?, ?)',
      [code, name, category_id || null, stock !== undefined ? Number(stock) : 1, status || 'Tersedia']
    );

    await logActivity(req.user?.id, `Menambahkan alat baru: ${name} (${code})`);
    res.status(201).json({ message: 'Alat berhasil ditambahkan!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateAlat = async (req, res) => {
  const { id } = req.params;
  const { code, name, category_id, stock, status } = req.body;

  if (!code || !name) {
    return res.status(400).json({ message: 'Kode alat dan nama alat wajib diisi!' });
  }

  try {
    const [existingCode] = await db.query('SELECT id FROM tools WHERE code = ? AND id != ?', [code, id]);
    if (existingCode.length > 0) {
      return res.status(400).json({ message: `Kode alat "${code}" sudah digunakan oleh alat lain!` });
    }

    const [result] = await db.query(
      'UPDATE tools SET code=?, name=?, category_id=?, stock=?, status=? WHERE id=?',
      [code, name, category_id || null, Number(stock) || 0, status || 'Tersedia', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data alat tidak ditemukan!' });
    }

    await logActivity(req.user?.id, `Memperbarui data alat: ${name} (${code})`);
    res.json({ message: 'Data alat berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteAlat = async (req, res) => {
  const { id } = req.params;
  try {
    const [tool] = await db.query('SELECT name, code FROM tools WHERE id = ?', [id]);
    if (tool.length === 0) {
      return res.status(404).json({ message: 'Data alat tidak ditemukan!' });
    }

    // Periksa apakah sedang dalam peminjaman aktif
    const [activeLoans] = await db.query(
      "SELECT id FROM loans WHERE tool_id = ? AND status IN ('Menunggu', 'Disetujui', 'Dipinjam')",
      [id]
    );
    if (activeLoans.length > 0) {
      return res.status(400).json({
        message: 'Tidak dapat menghapus alat ini karena masih terkait dengan peminjaman yang aktif!',
      });
    }

    await db.query('DELETE FROM tools WHERE id=?', [id]);
    await logActivity(req.user?.id, `Menghapus alat: ${tool[0].name} (${tool[0].code})`);
    res.json({ message: 'Alat berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
