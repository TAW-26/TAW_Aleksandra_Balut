import { Schema } from 'mongoose';

export const EventSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    location: { type: String, required: true },
    maxParticipants: { type: Number, default: 10 },
    category: {
        type: String,
        enum: ['sport', 'gry', 'dzieci', 'spotkania'],
        required: true
    },
    creatorId: { type: Number, required: true }, 
    participants: [{ type: Number }], 
    likes: [{ type: Number }]       
}, {
    timestamps: true
});