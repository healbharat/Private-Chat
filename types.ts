
export type User = 'user1' | 'user2';

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: Date;
}
