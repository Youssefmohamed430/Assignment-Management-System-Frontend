import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { notification } from '../../models/notification';
import { NotificationService } from '../../Services/notification-service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink,DatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  showNotifications: boolean = false;
  notifications: notification[];

  constructor(private notificationService: NotificationService,public authservice:AuthService) {
    this.notifications = this.notificationService.getNotifications();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  
  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId);
    this.notifications = this.notificationService.getNotifications();
  }

  public Logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}