import { Document, Model, model } from 'mongoose';
import { Event } from '../../interfaces/event.interface';
import { EventSchema } from '../schemas/data.schema';


export interface IEventDocument extends Event, Document {
    id: any;
}

export const EventModel: Model<IEventDocument> = model<IEventDocument>('Event', EventSchema);