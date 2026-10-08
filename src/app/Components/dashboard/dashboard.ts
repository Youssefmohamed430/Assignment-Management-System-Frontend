import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { InstructorService } from '../../Services/instructor-service';
import { StudentService } from '../../Services/student-service';
import { InstructorDashboardDto, StudentDashboardDto } from '../../models/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink, NgFor, NgIf, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  instructorData?: InstructorDashboardDto;
  studentData?: StudentDashboardDto;
  errorMessage = '';
  activityClass(activityType: string): string {
    const type = activityType.toLowerCase();
    if (type.includes('submission')) return 'activity-submission';
    if (type.includes('deadline')) return 'activity-deadline';
    return 'activity-notification';
  }
  constructor(public auth: AuthService, private instructors: InstructorService, private students: StudentService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    if (this.auth.isInstructor()) this.instructors.getDashboard().subscribe({
      next: (res) => { this.instructorData = res.result; this.cdr.markForCheck(); },
      error: (err) => { this.errorMessage = err?.error?.message || 'Could not load dashboard'; this.cdr.markForCheck(); },
    });
    else if (this.auth.isStudent()) this.students.getDashboard().subscribe({
      next: (res) => { this.studentData = res.result; this.cdr.markForCheck(); },
      error: (err) => { this.errorMessage = err?.error?.message || 'Could not load dashboard'; this.cdr.markForCheck(); },
    });
  }
}
