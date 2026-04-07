import { User } from '../interfaces/user.interface';
import { Event } from '../interfaces/event.interface';

export const users: User[] = [];
export const events: Event[] = [];

export let userIdCounter = 1;
export let eventIdCounter = 1;