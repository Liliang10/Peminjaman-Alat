import db from '../config/db.js';

export const getAllKategori = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT categories.*, COUNT(tools.id) AS total_tools 
      FROM categories 
      LEFT JOIN tools ON categories.id = tools.category_id 
      GROUP BY categories.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createKategori = async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Kategori berhasil ditambahkan!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};