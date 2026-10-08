import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { CourseService } from '../../Services/course-service';
import { CourseAnnouncement } from '../../models/course-announcement';

@Component({
  selector: 'app-course-announcements',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './course-announcements.html',
  styleUrl: './course-announcements.css',
})
export class CourseAnnouncements implements OnInit {
  courseId = 0;
  announcements: CourseAnnouncement[] = [];
  message = '';
  errorMessage = '';
  successMessage = '';
  isLoading = true;
  isPosting = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.courseId = Number(params.get('id'));
      this.loadAnnouncements();
    });
  }

  loadAnnouncements(): void {
    if (!this.courseId) return;
    this.isLoading = true;
    this.courseService.getCourseAnnouncements(this.courseId).subscribe({
      next: (response) => {
        this.announcements = response.result ?? [];
        this.errorMessage = '';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.announcements = [];
        this.errorMessage =
          error?.error?.message || error?.error || 'Could not load course announcements.';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  postAnnouncement(): void {
    const announcementMessage = this.message.trim();
    this.errorMessage = '';
    this.successMessage = '';
    if (!announcementMessage || this.isPosting) return;

    this.isPosting = true;
    this.courseService
      .createCourseAnnouncement(this.courseId, { message: announcementMessage })
      .subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Announcement posted.';
          this.message = '';
          this.isPosting = false;
          this.loadAnnouncements();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || error?.error || 'Could not post announcement.';
          this.isPosting = false;
          this.cdr.markForCheck();
        },
      });
  }
}
