import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SubmisiionService } from '../../Services/submisiion-service';
import { AssignmentService } from '../../Services/assignment-service';
import { IAssigment } from '../../models/iassigment';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private submissionService: SubmisiionService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (res) => {
        this.assignmentTitle = res.result?.title ?? '';
      },
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
    this.submissionService
      .submitAssignment(this.assignmentId, this.selectedFile)
      .subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Submitted successfully';
          setTimeout(() => {
            this.router.navigate(['/Courses/AssignmentDetails', this.courseId]);
          }, 800);
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Submission failed';
        },
      });
  }
}
