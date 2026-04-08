import { Router, Request, Response } from 'express';
import { EventController } from '../controllers/event.controller';

const router = Router();
const eventController = new EventController();


router.get('/', (req: Request, res: Response) => {
    try {
        const filters = {
            category: req.query.category as any,
            search: req.query.search as string
        };
        const result = eventController.getAllEvents(filters);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera podczas pobierania danych' });
    }
});

router.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const event = eventController.getEventById(id);

    if (!event) {
        return res.status(404).json({ message: `Wydarzenie o ID ${id} nie istnieje` });
    }
    res.status(200).json(event);
});

router.post('/', (req: Request, res: Response) => {
    try {
        if (!req.body.title) {
            return res.status(400).json({ error: 'Tytuł wydarzenia jest wymagany' });
        }
        const newEvent = eventController.createEvent(req.body, 1);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ error: 'Nieprawidłowe dane wejściowe' });
    }
});
router.put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const updated = eventController.updateEvent(id, req.body);

    if (!updated) {
        return res.status(404).json({ message: 'Nie znaleziono wydarzenia do aktualizacji' });
    }
    res.status(200).json(updated);
});
router.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const success = eventController.deleteEvent(id);

    if (!success) {
        return res.status(404).json({ message: 'Nie znaleziono wydarzenia do usunięcia' });
    }
    res.status(204).send(); 
});

router.post('/:id/like', (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);

    // Póki co zaszyte id użytkownika jako 1
    const userId = 1;

    const result = eventController.toggleLike(eventId, userId);

    if (!result) {
        return res.status(404).json({ message: 'Nie znaleziono wydarzenia' });
    }

    const message = result.liked ? 'Polubiono wydarzenie' : 'Usunięto polubienie';
    res.status(200).json({
        message,
        likesCount: result.count
    });
});
router.post('/:id/join', (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);

    const userId = 1;

    const success = eventController.joinEvent(eventId, userId);

    if (success) {
        res.status(200).json({ message: 'Pomyślnie dołączono do wydarzenia' });
    } else {
        
        const event = eventController.getEventById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Nie znaleziono wydarzenia' });
        }

        if (event.participants.length >= event.maxParticipants) {
            return res.status(400).json({ message: 'Brak wolnych miejsc na to wydarzenie' });
        }

        res.status(400).json({ message: 'Nie można dołączyć (prawdopodobnie już jesteś na liście)' });
    }
});
router.delete('/:id/join', (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);

    // Symulacja zalogowanego użytkownika (ID: 1)
    const userId = 1;

    const success = eventController.leaveEvent(eventId, userId);

    if (success) {
        res.status(200).json({ message: 'Pomyślnie wypisano się z wydarzenia' });
    } else {
        res.status(404).json({ message: 'Nie znaleziono zapisu na to wydarzenie' });
    }
});
export default router;