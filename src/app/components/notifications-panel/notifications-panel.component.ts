import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definir la interfaz para las notificaciones
export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'expense' | 'payment' | 'contribution' | 'goal' | 'system';
}

@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.css']
})
export class NotificationsPanelComponent {
  @Output() close = new EventEmitter<void>();
  
  // Datos estáticos de notificaciones
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Nuevo gasto añadido',
      message: 'Cena en grupo - $50.00. Revisa tu parte y paga fácilmente.',
      timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
      read: false,
      type: 'expense'
    },
    {
      id: 2,
      title: '¡Tu saldo se actualizó!',
      message: 'Miguel acaba de pagarte $30.00.',
      timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
      read: false,
      type: 'payment'
    },
    {
      id: 3,
      title: 'María acaba de aportar $20.000',
      message: 'a la meta \'Nuevo sofá 🛋️\': ¡Sigamos sumando!',
      timestamp: new Date(Date.now() - 86400000), // 1 día atrás
      read: true,
      type: 'contribution'
    },
    {
      id: 4,
      title: 'Tiempo de ahorrar',
      message: 'Aporta a tu meta \'Concierto 🎵\' y acércate a tu objetivo.',
      timestamp: new Date(Date.now() - 172800000), // 2 días atrás
      read: true,
      type: 'goal'
    },
    {
      id: 5,
      title: 'Nuevo miembro en el grupo',
      message: 'Carlos se ha unido al ShareExpense "Viaje Medellín".',
      timestamp: new Date(Date.now() - 259200000), // 3 días atrás
      read: true,
      type: 'system'
    },
    {
      id: 6,
      title: 'Recordatorio de pago',
      message: 'Tienes un pago pendiente de $45.000 en "Plata de Don Luis".',
      timestamp: new Date(Date.now() - 345600000), // 4 días atrás
      read: true,
      type: 'expense'
    },
    {
      id: 7,
      title: 'Meta alcanzada',
      message: '¡Felicidades! Has alcanzado tu meta "Vacaciones de verano".',
      timestamp: new Date(Date.now() - 432000000), // 5 días atrás
      read: true,
      type: 'goal'
    }
  ];
  
  // Contador de notificaciones no leídas
  get unreadCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }
  
  closePanel(): void {
    this.close.emit();
  }
  
  markAsRead(notification: Notification): void {
    if (!notification.read) {
      notification.read = true;
    }
  }
  
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }
  
  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
      return 'hace unos segundos';
    } else if (diffMin < 60) {
      return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHour < 24) {
      return `hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    } else if (diffDay < 30) {
      return `hace ${diffDay} ${diffDay === 1 ? 'día' : 'días'}`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'expense':
        return '💰';
      case 'payment':
        return '💵';
      case 'contribution':
        return '🎁';
      case 'goal':
        return '🎯';
      default:
        return '📢';
    }
  }
}