import db from '../config/db.js';
import { logActivity } from '../utils/logger.js';

export const getAllKategori = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT categories.*, COUNT(tools.id) AS total_tools 
      FROM categories 
      LEFT JOIN tools ON categories.id = tools.category_id 
      GROUP BY categories.id
      ORDER BY categories.id ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createKategori = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Nama kategori wajib diisi!' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Kategori "${name}" sudah ada!` });
    }

    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
    await logActivity(req.user?.id, `Menambahkan kategori baru: ${name.trim()}`);
    res.status(201).json({ message: 'Kategori berhasil ditambahkan!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateKategori = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'Nama kategori wajib diisi!' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?', [
      name.trim(),
      id,
    ]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Nama kategori "${name}" sudah digunakan!` });
    }

    const [result] = await db.query('UPDATE categories SET name=? WHERE id=?', [name.trim(), id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan!' });
    }

    await logActivity(req.user?.id, `Memperbarui nama kategori menjadi: ${name.trim()}`);
    res.json({ message: 'Kategori berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteKategori = async (req, res) => {
  const { id } = req.params;
  try {
    const [category] = await db.query('SELECT name FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan!' });
    }

    // Periksa apakah ada alat yang menggunakan kategori ini
    const [tools] = await db.query('SELECT id FROM tools WHERE category_id = ?', [id]);
    if (tools.length > 0) {
      return res.status(400).json({
        message: `Kategori "${category[0].name}" tidak dapat dihapus karena masih digunakan oleh ${tools.length} alat!`,
      });
    }

    await db.query('DELETE FROM categories WHERE id=?', [id]);
    await logActivity(req.user?.id, `Menghapus kategori: ${category[0].name}`);
    res.json({ message: 'Kategori berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
