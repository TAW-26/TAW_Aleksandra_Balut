import { EventModel, IEventDocument } from '../models/data.model';
import { Event, Category } from '../../interfaces/event.interface';

export class DataService {
    public async getAllEvents(filter?: { category?: Category; search?: string; dateFrom?: string; dateTo?: string }): Promise<IEventDocument[]> {
        const query: any = {};
        if (filter?.category) query.category = filter.category;
        if (filter?.search)
            query.title = { $regex: filter.search, $options: 'i' };
        if (filter?.dateFrom || filter?.dateTo) {
            query.date = {};
            if (filter.dateFrom) query.date.$gte = new Date(filter.dateFrom);
            if (filter.dateTo) query.date.$lte = new Date(filter.dateTo);
        }
        return await EventModel.find(query).exec();
    }

    public async createEvent(eventData: Partial<Event>): Promise<IEventDocument> {
        const newEvent = new EventModel(eventData);
        return await newEvent.save();
    }

    public async getEventById(id: string): Promise<IEventDocument | null> {
        return await EventModel.findById(id).exec();
    }

    public async joinEvent(eventId: string, userId: string): Promise<IEventDocument | null> {
        return await EventModel.findByIdAndUpdate(
            eventId,
            { $addToSet: { participants: userId } }, 
            { new: true }
        ).exec();
    }

    public async updateEvent(id: string, data: Partial<Event>): Promise<IEventDocument | null> {
        return await EventModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).exec();
    }

    public async leaveEvent(eventId: string, userId: string): Promise<IEventDocument | null> {
        return await EventModel.findByIdAndUpdate(
            eventId,
            { $pull: { participants: userId } }, // Usuwa konkretne ID z tablicy
            { new: true }
        ).exec();
    }

    public async toggleLike(eventId: string, userId: string): Promise<IEventDocument | null> {
        const event = await EventModel.findById(eventId);
        if (!event) return null;

        const isLiked = event.likes.includes(userId);
        const update = isLiked
            ? { $pull: { likes: userId } }
            : { $addToSet: { likes: userId } };

        return await EventModel.findByIdAndUpdate(eventId, update, { new: true }).exec();
    }

    public async deleteEvent(id: string): Promise<boolean> {
        const result = await EventModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    public async removeParticipant(eventId: string, userId: string): Promise<IEventDocument | null> {
        return await EventModel.findByIdAndUpdate(
            eventId,
            { $pull: { participants: userId } },
            { new: true }
        ).exec();
    }
}