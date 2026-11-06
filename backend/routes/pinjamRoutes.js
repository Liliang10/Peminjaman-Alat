import express from 'express';
import {
  ajukanPeminjaman,
  getAllPeminjaman,
  updateStatusPeminjaman,
  deletePeminjaman,
} from '../controllers/pinjamController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/ajukan', verifyToken, checkRole(['peminjam', 'admin']), ajukanPeminjaman);
router.get('/', verifyToken, checkRole(['admin', 'petugas', 'peminjam']), getAllPeminjaman);
router.put('/:id/status', verifyToken, checkRole(['admin', 'petugas']), updateStatusPeminjaman);
router.delete('/:id', verifyToken, checkRole(['admin', 'petugas', 'peminjam']), deletePeminjaman);

export default router;
