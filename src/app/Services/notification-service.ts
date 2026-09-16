import { Injectable } from '@angular/core';
import { notification } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: notification[] = [
    { id: 1, message: 'New assignment available', date: new Date() },
    { id: 2, message: 'Assignment deadline approaching', date: new Date() },
    { id: 3, message: 'Course enrollment successful', date: new Date() },
  ];
  
  getNotifications(): notification[] {
    return this.notifications;
  }

  public markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
  }
}
