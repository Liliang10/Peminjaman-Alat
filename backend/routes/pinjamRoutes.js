import express from 'express';
import { ajukanPeminjaman, getAllPeminjaman, updateStatusPeminjaman } from '../controllers/pinjamController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/ajukan', verifyToken, checkRole(['peminjam']), ajukanPeminjaman);
router.get('/', verifyToken, checkRole(['admin', 'petugas', 'peminjam']), getAllPeminjaman);
router.put('/:id/status', verifyToken, checkRole(['admin', 'petugas']), updateStatusPeminjaman);

export default router;