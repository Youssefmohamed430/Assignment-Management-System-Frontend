import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationItem } from '../../models/notification';
import { NotificationService } from '../../Services/notification-service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  showNotifications = false;
  notifications: NotificationItem[] = [];
  isLoggedIn = false;
  private sub?: Subscription;

  constructor(
    private notificationService: NotificationService,
    public authservice: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.authservice.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn && this.authservice.isStudent()) {
        this.loadNotifications();
      } else {
        this.notifications = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = res.result ?? [];
      },
      error: () => {
        this.notifications = [];
      },
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications && this.authservice.isStudent()) {
      this.loadNotifications();
    }
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notificationId
        );
      },
    });
  }

  public Logout(): void {
    this.authservice.logout();
    this.showNotifications = false;
    this.router.navigateByUrl('/Login');
  }
}
