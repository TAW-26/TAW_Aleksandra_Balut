import { Document, Model, model } from 'mongoose';
import { Event } from '../../interfaces/event.interface';
import { User } from '../../interfaces/user.interface';
import { EventSchema } from '../schemas/data.schema';
import { UserSchema } from '../schemas/user.schema';

export interface IEventDocument extends Event, Document {
    id: any;
}
export interface IUserDocument extends User, Document {
    id: any;
}

export const EventModel: Model<IEventDocument> = model<IEventDocument>('Event', EventSchema);
export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);