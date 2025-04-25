import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification.model';
@Component({
  selector: 'app-notifications-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.css']
})
export class NotificationsPanelComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  notifications: Notification[] = [];
  loading = false;
  error = '';
  
  constructor(private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    this.loadNotifications();
  }
  
  // Cargar notificaciones desde el backend
  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getAllNotificationByUser()
    .then((res: any) => {
      this.notifications = res.data.reverse();
      this.loading = false;
    })
    .catch((err: any) => {
      console.error('Error al cargar notificaciones:', err);
    });
  }
  
  // Contador de notificaciones no leídas
  get unreadCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }
  
  closePanel(): void {
    this.close.emit();
  }
  
  markAsRead(notification: Notification): void {
    console.log('Faltan implementar');
    
  }
  
  markAllAsRead(): void {
    console.log('Faltan implementar');

  }
  
  deleteNotification(event: Event, notification: Notification): void {
    this.notificationService.deleteNotification(notification.id_notification)
    .then((res: any) => {
      this.notifications = this.notifications.filter(n => n.id_notification !== notification.id_notification);
    })
    .catch((err: any) => {
      console.error('Error al eliminar notificación:', err);
    });
  }
  
  deleteAllNotifications(): void {
    this.notificationService.deleteAllNotifications()
    .then((res: any) => {
      this.notifications = [];
    })
    .catch((err: any) => {
      console.error('Error al eliminar todas las notificaciones:', err);
    });
    
  }

  
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'payment':
        return '💵';
      case 'debt':
        return '🎁';
      case 'goal':
        return '🎯';
      case 'general':
        return '📢';
      default:
        return '📢';
    }
  }
}