export type Category = 'sport' | 'gry' | 'dzieci' | 'spotkania';
export interface Event {
    id: number;
    title: string;
    description: string;
    date: Date;
    location: string;
    category: string;
    maxParticipants: number;
    participants: string[];
    likes: string[];
    creatorId: string;
    createdAt: Date;
}