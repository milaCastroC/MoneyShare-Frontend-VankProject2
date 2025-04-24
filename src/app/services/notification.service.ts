import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { Notification } from '../components/notifications-panel/notifications-panel.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) { }

  // Obtener todas las notificaciones del usuario actual
  getNotifications(): Observable<{data: Notification[]}> {
    return this.http.get<{data: Notification[]}>(`${this.apiUrl}/find/all`);
  }

  // Obtener una notificación específica
  getNotificationById(id: string): Observable<{data: Notification}> {
    return this.http.get<{data: Notification}>(`${this.apiUrl}/find/${id}`);
  }

  // Eliminar una notificación
  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Eliminar todas las notificaciones
  deleteAllNotifications(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/all`);
  }

  // Marcar una notificación como leída
  markAsRead(id: string): Observable<any> {
    // Nota: Este endpoint no existe aún en el backend, necesitarás agregarlo
    return this.http.patch(`${this.apiUrl}/read/${id}`, {});
  }

  // Marcar todas las notificaciones como leídas
  markAllAsRead(): Observable<any> {
    // Nota: Este endpoint no existe aún en el backend, necesitarás agregarlo
    return this.http.patch(`${this.apiUrl}/read/all`, {});
  }
}