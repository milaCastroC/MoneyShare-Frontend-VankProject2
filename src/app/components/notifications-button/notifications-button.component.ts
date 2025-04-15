import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsPanelComponent } from '../notifications-panel/notifications-panel.component';

@Component({
  selector: 'app-notification-button',
  standalone: true,
  imports: [CommonModule, NotificationsPanelComponent],
  templateUrl: './notifications-button.component.html',
  styleUrls: ['./notifications-button.component.css']
})
export class NotificationButtonComponent {
  showPanel = false;
  unreadCount = 2; // Número estático de notificaciones no leídas
  
  togglePanel(): void {
    this.showPanel = !this.showPanel;
  }
  
  closePanel(): void {
    this.showPanel = false;
  }
}