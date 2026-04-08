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
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Opcjonalnie, pozwala na .populate('creatorId')
        required: true
    },

    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]     
}, {
    timestamps: true
});