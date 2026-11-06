import express from 'express';
import { getAllLogs } from '../controllers/logController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, checkRole(['admin']), getAllLogs);

export default router;

