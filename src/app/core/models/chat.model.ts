import { Message } from './message.model';

export interface Chat {
    id: string;
    title?: string;
    messages: Message[];
}