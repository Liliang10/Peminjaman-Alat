import express from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, checkRole(['admin']), getAllUsers);
router.post('/', verifyToken, checkRole(['admin']), createUser);
router.put('/:id', verifyToken, checkRole(['admin']), updateUser);
router.delete('/:id', verifyToken, checkRole(['admin']), deleteUser);

export default router;
