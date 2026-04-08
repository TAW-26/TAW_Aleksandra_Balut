import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const router = Router();
const eventController = new EventController();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, eventController.updateEvent);
router.post('/:id/join', authMiddleware, eventController.joinEvent);
router.delete('/:id/join', authMiddleware, eventController.leaveEvent);
router.post('/:id/like', authMiddleware, eventController.toggleLike);
router.delete('/:id', authMiddleware, eventController.deleteEvent);

export default router;