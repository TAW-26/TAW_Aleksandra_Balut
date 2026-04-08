import { events } from '../modules/database';
import { Event, Category } from '../interfaces/event.interface';

export class EventController {

    public createEvent(data: Partial<Event>, userId: number): Event {
        const newEvent: Event = {
            id: events.length + 1,
            title: data.title!,
            description: data.description!,
            date: new Date(data.date!),
            location: data.location!,
            category: data.category,
            maxParticipants: data.maxParticipants || 10,
            participants: [],
            likes: [],
            creatorId: userId,
            createdAt: new Date()
      
        };

        events.push(newEvent);
        return newEvent;
    }

    public getAllEvents(filter?: { category?: Category; search?: string }): Event[] {
        let result = [...events];
        if (filter?.category) {
            result = result.filter(e => e.category === filter.category);
        }
        if (filter?.search) {
            result = result.filter(e => e.title.toLowerCase().includes(filter.search!.toLowerCase()));
        }
        return result;
    }
    public getEventById(id: number): Event | undefined {
        return events.find(e => e.id === id);
    }

    public updateEvent(id: number, data: Partial<Event>): Event | null {
        const index = events.findIndex(e => e.id === id);
        if (index === -1) return null;

        events[index] = { ...events[index], ...data, id }; // Zachowujemy oryginalne ID
        return events[index];
    }

    public deleteEvent(id: number): boolean {
        const index = events.findIndex(e => e.id === id);
        if (index === -1) return false;

        events.splice(index, 1);
        return true;
    }

    
    public joinEvent(eventId: number, userId: number): boolean {
        const event = events.find(e => e.id === eventId);
        if (event && !event.participants.includes(userId)) {
            if (event.participants.length < event.maxParticipants) {
                event.participants.push(userId);
                return true;
            }
        }
        return false;
    }
    public leaveEvent(eventId: number, userId: number): boolean {
        const event = events.find(e => e.id === eventId);

        if (event) {
            const index = event.participants.indexOf(userId);
            if (index !== -1) {
                event.participants.splice(index, 1);
                return true;
            }
        }
        return false;
    }


    public toggleLike(eventId: number, userId: number): { liked: boolean, count: number } | null {
        const event = events.find(e => e.id === eventId);

        if (!event) return null;

        
        if (!event.likes) event.likes = [];

        const index = event.likes.indexOf(userId);

        if (index === -1) {
            
            event.likes.push(userId);
            return { liked: true, count: event.likes.length };
        } else {
            
            event.likes.splice(index, 1);
            return { liked: false, count: event.likes.length };
        }
    }
}