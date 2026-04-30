export interface EventModel {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  location: string;
  maxParticipants: number;

  category: 'sport' | 'gry' | 'dzieci' | 'spotkania';
  creatorId: string;
  participants: string[];
  likes: string[];
}
