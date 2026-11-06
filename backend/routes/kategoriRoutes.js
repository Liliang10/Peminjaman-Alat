import express from 'express';
import { getAllKategori, createKategori } from '../controllers/kategoriController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllKategori);
router.post('/', verifyToken, checkRole(['admin']), createKategori);

export default router;