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
}