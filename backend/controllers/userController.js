import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import { logActivity } from '../utils/logger.js';

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi!' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = role || 'peminjam';

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    await logActivity(req.user?.id, `Menambahkan pengguna baru: ${name} (${userRole})`);
    res.status(201).json({ message: 'Pengguna berhasil ditambahkan!', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Nama dan email wajib diisi!' });
  }

  try {
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, id]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan pengguna lain!' });
    }

    if (password && password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await db.query(
        'UPDATE users SET name=?, email=?, role=?, password=? WHERE id=?',
        [name, email, role || 'peminjam', hashedPassword, id]
      );
    } else {
      await db.query(
        'UPDATE users SET name=?, email=?, role=? WHERE id=?',
        [name, email, role || 'peminjam', id]
      );
    }

    await logActivity(req.user?.id, `Memperbarui data pengguna: ${name} (${role})`);
    res.json({ message: 'Data pengguna berhasil diperbarui!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (Number(req.user?.id) === Number(id)) {
    return res.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif!' });
  }

  try {
    const [user] = await db.query('SELECT name, role FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan!' });
    }

    // Periksa apakah user memiliki pinjaman aktif
    const [activeLoans] = await db.query(
      "SELECT id FROM loans WHERE user_id = ? AND status IN ('Menunggu', 'Disetujui', 'Dipinjam')",
      [id]
    );
    if (activeLoans.length > 0) {
      return res.status(400).json({
        message: 'Pengguna tidak dapat dihapus karena masih memiliki riwayat pinjaman aktif!',
      });
    }

    await db.query('DELETE FROM users WHERE id=?', [id]);
    await logActivity(req.user?.id, `Menghapus pengguna: ${user[0].name} (${user[0].role})`);
    res.json({ message: 'Pengguna berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
