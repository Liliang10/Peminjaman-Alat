import db from '../config/db.js';

export const getAllLogs = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        activity_logs.id,
        activity_logs.user_id,
        activity_logs.action,
        activity_logs.created_at,
        users.name AS user_name,
        users.role AS user_role,
        users.email AS user_email
      FROM activity_logs
      LEFT JOIN users ON activity_logs.user_id = users.id
      ORDER BY activity_logs.id DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

