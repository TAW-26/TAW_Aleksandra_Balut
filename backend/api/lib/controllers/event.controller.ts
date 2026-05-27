import { events } from '../modules/database';
import { Request, Response } from 'express';
import { DataService } from '../modules/services/data.service';
import { Event, Category } from '../interfaces/event.interface';

export class EventController {
    private dataService: DataService;

    constructor() {
        this.dataService = new DataService();
    }
    public createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.userId;
            const newEvent = await this.dataService.createEvent({
                ...req.body,
                creatorId: userId
            });
            res.status(201).json(newEvent);
        } catch (error) {
            res.status(400).json({ error: 'Nie udało się utworzyć wydarzenia' });
        }
    };

    public getAllEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters = {
                category: req.query.category as Category,
                search: req.query.search as string,
                dateFrom: req.query.dateFrom as string,
                dateTo: req.query.dateTo as string
            };
            const events = await this.dataService.getAllEvents(filters);
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas pobierania wydarzeń' });
        }
    };
    public getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const event = await this.dataService.getEventById(req.params.id);
            if (!event) {
                res.status(404).json({ message: 'Nie znaleziono wydarzenia' });
                return;
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas pobierania szczegółów wydarzenia' });
        }
    };

    public updateEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const updatedEvent = await this.dataService.updateEvent(req.params.id, req.body);
            if (!updatedEvent) {
                res.status(404).json({ message: 'Nie znaleziono wydarzenia do aktualizacji' });
                return;
            }
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(400).json({ error: 'Błąd podczas aktualizacji wydarzenia' });
        }
    };

    public deleteEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const success = await this.dataService.deleteEvent(req.params.id);
            if (!success) {
                res.status(404).json({ message: 'Wydarzenie nie istnieje' });
                return;
            }
            res.status(200).json({ message: 'Wydarzenie usunięte' });
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas usuwania' });
        }
    };

    
    public joinEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = req.params.id; 
            const userId = (req as any).user.userId;

            const updatedEvent = await this.dataService.joinEvent(eventId, userId);

            if (!updatedEvent) {
                res.status(404).json({ message: 'Nie znaleziono wydarzenia' });
                return;
            }
            res.status(200).json({ message: 'Dołączono do wydarzenia', event: updatedEvent });
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas dołączania' });
        }
    };
    public leaveEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user.userId;
            const updatedEvent = await this.dataService.leaveEvent(req.params.id, userId);

            if (!updatedEvent) {
                res.status(404).json({ message: 'Nie znaleziono wydarzenia' });
                return;
            }
            res.status(200).json({ message: 'Wypisano się z wydarzenia', event: updatedEvent });
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas rezygnacji z wydarzenia' });
        }
    };


    public toggleLike = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = req.params.id;
            const userId = (req as any).user.userId;

            const updatedEvent = await this.dataService.toggleLike(eventId, userId);

            if (!updatedEvent) {
                res.status(404).json({ message: 'Nie znaleziono wydarzenia' });
                return;
            }

            const isLiked = updatedEvent.likes.includes(userId);
            res.status(200).json({
                message: isLiked ? 'Polubiono' : 'Odlubiono',
                likesCount: updatedEvent.likes.length
            });
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas zmiany polubienia' });
        }
    };
    public removeParticipant = async (req: Request, res: Response): Promise<void> => {
        try {
            const eventId = req.params.eventId;
            const userId = req.params.userId;
            const requesterId = (req as any).user.userId;
            // pobierz event
            const event = await this.dataService.getEventById(eventId);
            if (!event) {
                res.status(404).json({ message: 'Wydarzenie nie istnieje' });
                return;
            }
            // sprawdź czy to organizator
            if (event.creatorId.toString() !== requesterId) {
                res.status(403).json({ message: 'Brak uprawnień' });
                return;
            }
            const updatedEvent = await this.dataService.removeParticipant(eventId, userId);
            res.status(200).json({
                message: 'Usunięto uczestnika',
                event: updatedEvent
            });
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas usuwania uczestnika' });
        }
    };
}