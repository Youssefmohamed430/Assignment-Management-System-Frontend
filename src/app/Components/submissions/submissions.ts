import { Component, OnInit } from '@angular/core';
import { Submission } from '../../models/submission';
import { SubmisiionService } from '../../Services/submisiion-service';
import { InstructorService } from '../../Services/instructor-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssignmentStudentGrades } from '../../models/assignment-student-grades';

@Component({
  selector: 'app-submissions',
  imports: [FormsModule, RouterLink],
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

  constructor(
    private submissionService: SubmisiionService,
    private instructorService: InstructorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.loadSubmissions();
    this.loadGrades();
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissions(this.assignmentId).subscribe({
      next: (res) => {
        this.submissionList = res.result ?? [];
        this.submissionList.forEach((s) => {
          this.gradeInputs[s.submissionId!] = s.grade ?? null;
        });
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load submissions';
        this.submissionList = [];
      },
    });
  }

  loadGrades(): void {
    this.instructorService.getAssignmentGrades(this.assignmentId).subscribe({
      next: (res) => {
        this.grades = res.result ?? [];
      },
      error: () => {
        this.grades = [];
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
        this.loadSubmissions();
        this.loadGrades();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to save grade';
      },
    });
  }
}
