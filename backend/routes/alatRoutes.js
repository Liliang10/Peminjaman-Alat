import express from 'express';
import { getAllAlat, createAlat, updateAlat, deleteAlat } from '../controllers/alatController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllAlat);
router.post('/', verifyToken, checkRole(['admin']), createAlat);
router.put('/:id', verifyToken, checkRole(['admin']), updateAlat);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteAlat);

export default router;