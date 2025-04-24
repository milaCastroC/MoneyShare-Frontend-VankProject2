import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private api: ApiService) { }

  getAllNotificationByUser(){
    return this.api.get(`/notification/find/all`);
  }

  getNotificationById(id: number){
    return this.api.get(`/notification/find/${id}`);
  }

  deleteNotification(id: number){
    return this.api.delete(`/notification/delete/${id}`);
  }

  deleteAllNotifications(){
    return this.api.delete(`/notification/all`);
  }

  createWelcomeNotification(){
    return this.api.post(`/notification/welcome`);
  }
  /** 
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
  */
}