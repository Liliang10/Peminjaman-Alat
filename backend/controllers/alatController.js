import db from '../config/db.js';

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
  try {
    await db.query(
      'INSERT INTO tools (code, name, category_id, stock, status) VALUES (?, ?, ?, ?, ?)',
      [code, name, category_id, stock || 1, status || 'Tersedia']
    );
    res.status(201).json({ message: 'Alat berhasil ditambahkan!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateAlat = async (req, res) => {
  const { id } = req.params;
  const { code, name, category_id, stock, status } = req.body;
  try {
    await db.query(
      'UPDATE tools SET code=?, name=?, category_id=?, stock=?, status=? WHERE id=?',
      [code, name, category_id, stock, status, id]
    );
    res.json({ message: 'Data alat berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteAlat = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tools WHERE id=?', [id]);
    res.json({ message: 'Alat berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};