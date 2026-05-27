import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
const router = Router();
const userController = new UserController();
router.get('/:id', userController.getUserById);
export default router;