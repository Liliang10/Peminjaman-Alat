import db from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};