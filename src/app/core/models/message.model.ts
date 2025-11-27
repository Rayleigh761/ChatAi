export type MessageType = 'sent' | 'received' | 'typing';

export interface Message {
    id: string;
    text: string;
    type: MessageType;
    timestamp: string; // ISO
    meta?: Record<string, any>;
    sender?: string;    
}