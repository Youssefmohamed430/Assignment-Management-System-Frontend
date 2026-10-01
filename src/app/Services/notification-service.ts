import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationItem } from '../models/notification';
import { ResponseModel } from '../models/response-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private httpclient: HttpClient) {}

  getNotifications(): Observable<ResponseModel<NotificationItem[]>> {
    return this.httpclient.get<ResponseModel<NotificationItem[]>>(
      `${environment.baseUrl}/Notification`
    );
  }

  markAsRead(notificationId: number): Observable<ResponseModel<unknown>> {
    return this.httpclient.put<ResponseModel<unknown>>(
      `${environment.baseUrl}/Notification/MarkasRead/${notificationId}`,
      {}
    );
  }
}
