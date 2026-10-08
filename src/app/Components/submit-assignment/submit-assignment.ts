import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SubmisiionService } from '../../Services/submisiion-service';
import { AssignmentService } from '../../Services/assignment-service';
import { IAssigment } from '../../models/iassigment';
import { StudentService } from '../../Services/student-service';

@Component({
  selector: 'app-submit-assignment',
  imports: [FormsModule, RouterLink],
  templateUrl: './submit-assignment.html',
  styleUrl: './submit-assignment.css',
})
export class SubmitAssignment implements OnInit {
  courseId = 0;
  assignmentId = 0;
  assignmentTitle = '';
  selectedFile?: File;
  errorMessage = '';
  successMessage = '';
  nextAttemptNumber = 1;
  assignmentStatus = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmisiionService,
    private assignmentService: AssignmentService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (res) => {
        this.assignmentTitle = res.result?.title ?? '';
        this.assignmentStatus = res.result?.status ?? 1;
        this.cdr.markForCheck();
      },
    });
    this.studentService.getSubmitDetails(this.assignmentId).subscribe({
      next: (res: any) => {
        const result = res?.result ?? res?.data ?? res;
        const submissions = Array.isArray(result) ? result : result ? [result] : [];
        const lastAttempt = submissions.reduce(
          (max: number, item: any) => Math.max(max, Number(item?.attemptNumber ?? 0)),
          0
        );
        this.nextAttemptNumber = lastAttempt + 1;
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file';
      return;
    }
    if (this.assignmentStatus !== 1) {
      this.errorMessage = 'This assignment is not open for submissions.';
      return;
    }
    this.submissionService
      .submitAssignment(this.assignmentId, this.selectedFile)
      .subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Submitted successfully';
          this.cdr.markForCheck();
          setTimeout(() => {
            this.router.navigate(['/Courses/AssignmentDetails', this.courseId]);
          }, 800);
        },
        error: (error) => {
          const message = error?.error?.message || error?.error?.Message || '';
          const lower = message.toLowerCase();
          this.errorMessage = lower.includes('draft') ? 'This assignment is still a draft.'
            : lower.includes('closed') ? 'This assignment is closed and no longer accepts submissions.'
            : lower.includes('archived') ? 'This assignment is archived and no longer accepts submissions.'
            : message || 'Submission failed';
          this.cdr.markForCheck();
        },
      });
  }
}
