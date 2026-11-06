import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = role || 'peminjam';

    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    return res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

export const login = async (req, res) => {
  console.log('>>> [LOGIN ATTEMPT] Body received:', req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('>>> [LOGIN ERROR] Email or password missing');
      return res.status(400).json({ message: 'Email dan password harus diisi!' });
    }

    console.log('>>> [LOGIN DB] Querying database for email:', email);
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('>>> [LOGIN DB] Query result count:', users.length);

    if (users.length === 0) {
      return res.status(400).json({ message: 'Email atau password salah!' });
    }

    const user = users[0];

    console.log('>>> [LOGIN BCRYPT] Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('>>> [LOGIN BCRYPT] Match result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah!' });
    }

    console.log('>>> [LOGIN JWT] Signing token...');
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    console.log('>>> [LOGIN SUCCESS] Sending response to client');
    return res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('>>> [LOGIN CATCH ERROR]:', error);
    return res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};