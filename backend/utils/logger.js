import db from '../config/db.js';

export const logActivity = async (userId, action) => {
  try {
    await db.query('INSERT INTO activity_logs (user_id, action) VALUES (?, ?)', [
      userId || null,
      action,
    ]);
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

