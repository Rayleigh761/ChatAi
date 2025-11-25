export type MessageType = 'sent' | 'received' | 'system';

export interface Message {
    id: string;
    text: string;
    type: MessageType;
    timestamp: string; // ISO
    status: string;
    meta?: Record<string, any>;
}