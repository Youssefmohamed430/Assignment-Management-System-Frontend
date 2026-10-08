import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { Submission } from '../../models/submission';
import { SubmisiionService } from '../../Services/submisiion-service';
import { InstructorService } from '../../Services/instructor-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssignmentStudentGrades } from '../../models/assignment-student-grades';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-submissions',
  imports: [FormsModule, RouterLink, StatusBadge, DatePipe, NgIf],
  templateUrl: './submissions.html',
  styleUrl: './submissions.css',
})
export class Submissions implements OnInit {
  assignmentId = 0;
  submissionList: Submission[] = [];
  grades: AssignmentStudentGrades[] = [];
  gradeInputs: Record<number, number | null> = {};
  errorMessage = '';
  successMessage = '';
  feedbackInputs: Record<number, string> = {};

  constructor(
    private submissionService: SubmisiionService,
    private instructorService: InstructorService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.loadSubmissions();
    this.loadGrades();
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions(this.assignmentId).subscribe({
      next: (res: any) => {
        const data = res?.result ?? res?.data ?? res;
        this.submissionList = Array.isArray(data)
          ? data
          : data && typeof data === 'object'
          ? [data]
          : [];
        this.submissionList.forEach((s: any) => {
          const id = s.submissionId ?? s.id;
          if (id) {
            this.gradeInputs[id] = s.grade ?? null;
            this.feedbackInputs[id] = s.feedback ?? '';
          }
        });
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load submissions';
        this.submissionList = [];
        this.cdr.markForCheck();
      },
    });
  }

  loadGrades(): void {
    this.instructorService.getAssignmentGrades(this.assignmentId).subscribe({
      next: (res: any) => {
        const data = res?.result ?? res?.data ?? res;
        this.grades = Array.isArray(data)
          ? data
          : data && typeof data === 'object'
          ? [data]
          : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.grades = [];
        this.cdr.markForCheck();
      },
    });
  }

  ViewFile(submissionId: number): void {
    this.submissionService.getSubmissionFile(submissionId).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to download file';
        this.cdr.markForCheck();
      },
    });
  }

  saveGrade(submissionId: number): void {
    const grade = this.gradeInputs[submissionId];
    this.errorMessage = '';
    this.successMessage = '';
    if (grade == null || grade < 0 || grade > 10) {
      this.errorMessage = 'Grade must be between 0 and 10';
      return;
    }
    this.instructorService.setGrade(submissionId, grade).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Grade saved';
        this.cdr.markForCheck();
        this.loadSubmissions();
        this.loadGrades();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to save grade';
        this.cdr.markForCheck();
      },
    });
  }

  saveFeedback(submissionId: number): void {
    this.instructorService.setFeedback(submissionId, this.feedbackInputs[submissionId] ?? '').subscribe({
      next: (res) => { this.successMessage = res.message || 'Feedback saved'; this.loadSubmissions(); this.cdr.markForCheck(); },
      error: (error) => { this.errorMessage = error?.error?.message || 'Failed to save feedback'; this.cdr.markForCheck(); },
    });
  }
}
