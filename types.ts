
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  text: string;
  timestamp: Date;
}

export interface ConversationContext {
  topic: string;
}
