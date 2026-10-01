import { Component } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { AssignmentService } from '../../Services/assignment-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { ResponseModel } from '../../models/response-model';
import { StudentService } from '../../Services/student-service';
import { AssignmentSubsDetails } from '../../models/assignment-subs-details';

@Component({
  selector: 'app-assignment-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './assignment-details.html',
  styleUrl: './assignment-details.css',
})
export class AssignmentDetails {
  AssignmentList: IAssigment[] = [];
  public crsid = 0;
  errorMessage = '';
  successMessage = '';
  submitDetails: Record<number, AssignmentSubsDetails> = {};

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    public authservice: AuthService,
    private studentService: StudentService
  ) {
    this.crsid = Number(this.route.snapshot.params['id']);
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentService.getAssignmentByCrsId(this.crsid).subscribe({
      next: (response: ResponseModel<IAssigment[]>) => {
        this.AssignmentList = response.result ?? [];
        if (this.authservice.isStudent()) {
          this.AssignmentList.forEach((a) => this.loadSubmitDetails(a.assignmentId));
        }
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load assignments';
      },
    });
  }

  loadSubmitDetails(assignmentId: number): void {
    this.studentService.getSubmitDetails(assignmentId).subscribe({
      next: (res) => {
        this.submitDetails[assignmentId] = res.result;
      },
      error: () => {
        /* no submission yet */
      },
    });
  }

  ViewAssignmentFile(id: number): void {
    this.assignmentService.getAssignmentFile(id).subscribe({
      next: (fileBlob: Blob) => {
        const fileUrl = URL.createObjectURL(fileBlob);
        window.open(fileUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Assignment file not found';
      },
    });
  }

  public DeleteAssignment(assignmentId: number): void {
    this.errorMessage = '';
    this.assignmentService.deleteAssignment(assignmentId).subscribe({
      next: () => {
        this.successMessage = 'Assignment deleted';
        this.loadAssignments();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to delete assignment';
      },
    });
  }
}
