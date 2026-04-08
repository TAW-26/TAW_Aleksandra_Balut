import { Router } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();
const eventController = new EventController();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.post('/:id/join', eventController.joinEvent);
router.delete('/:id/join', eventController.leaveEvent);
router.post('/:id/like', eventController.toggleLike);
router.delete('/:id', eventController.deleteEvent);

export default router;