import express from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, checkRole(['admin']), getAllUsers);

export default router;