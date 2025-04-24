export interface Notification {
    id_notification : number;
    id_user: number;
    message: string;
    type: 'payment' | 'debt' | 'goal' | 'general';
    date: Date;
    read?: boolean;
  }