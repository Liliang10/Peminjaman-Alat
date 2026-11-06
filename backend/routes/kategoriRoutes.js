import express from 'express';
import {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} from '../controllers/kategoriController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllKategori);
router.post('/', verifyToken, checkRole(['admin']), createKategori);
router.put('/:id', verifyToken, checkRole(['admin']), updateKategori);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteKategori);

export default router;
