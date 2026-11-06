import db from '../config/db.js';

export const ajukanPeminjaman = async (req, res) => {
  const { tool_id, loan_date, return_date, reason } = req.body;
  const user_id = req.user.id; // Dari Token JWT

  try {
    await db.query(
      'INSERT INTO loans (user_id, tool_id, loan_date, return_date, reason) VALUES (?, ?, ?, ?, ?)',
      [user_id, tool_id, loan_date, return_date, reason]
    );
    res.status(201).json({ message: 'Pengajuan peminjaman berhasil dikirim!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getAllPeminjaman = async (req, res) => {
  try {
    let query = `
      SELECT loans.*, users.name AS user_name, tools.name AS tool_name 
      FROM loans 
      JOIN users ON loans.user_id = users.id 
      JOIN tools ON loans.tool_id = tools.id
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
  const { status } = req.body; // 'Disetujui', 'Ditolak', 'Selesai'

  try {
    await db.query('UPDATE loans SET status=? WHERE id=?', [status, id]);
    res.json({ message: `Status peminjaman diperbarui menjadi ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};