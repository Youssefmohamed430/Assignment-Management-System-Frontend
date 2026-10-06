import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { AssignmentService } from '../../Services/assignment-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { StudentService } from '../../Services/student-service';
import { AssignmentSubsDetails } from '../../models/assignment-subs-details';
import { ResponseModel } from '../../models/response-model';

@Component({
  selector: 'app-assignment-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './assignment-details.html',
  styleUrl: './assignment-details.css',
})
export class AssignmentDetails implements OnInit {
  AssignmentList: IAssigment[] = [];
  public crsid = 0;
  errorMessage = '';
  successMessage = '';
  submitDetails: Record<number, AssignmentSubsDetails> = {};

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    public authservice: AuthService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.crsid = Number(params.get('id'));
      this.loadAssignments();
      this.cdr.markForCheck();
    });
  }

  loadAssignments(): void {
    if (!this.crsid) return;
    this.assignmentService.getAssignmentByCrsId(this.crsid).subscribe({
      next: (response: ResponseModel<IAssigment[]>) => {
        const list = response.result ?? [];

        this.AssignmentList = list.map((a: any) => ({
          ...a,
          assignmentId: a.assignmentId ?? a.id ?? 0,
          title: a.title ?? '',
          deadLine: a.deadLine || a.deadline || '',
          crsId: a.crsId ?? a.courseId ?? this.crsid,
          crsName: a.crsName ?? a.courseName ?? '',
          fileName: a.fileName ?? '',
        }));

        if (this.authservice.isStudent()) {
          this.AssignmentList.forEach((a) =>
            this.loadSubmitDetails(a.assignmentId)
          );
        }

        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load assignments';
        this.cdr.markForCheck();
      },
    });
  }

  loadSubmitDetails(assignmentId: number): void {
    this.studentService.getSubmitDetails(assignmentId).subscribe({
      next: (res: any) => {
        const data = res?.result ?? res?.data ?? res;
        if (data) {
          this.submitDetails[assignmentId] = data;
          this.cdr.markForCheck();
        }
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
        this.cdr.markForCheck();
      },
    });
  }

  public DeleteAssignment(assignmentId: number): void {
    this.errorMessage = '';
    this.assignmentService.deleteAssignment(assignmentId).subscribe({
      next: () => {
        this.successMessage = 'Assignment deleted';
        this.cdr.markForCheck();
        this.loadAssignments();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to delete assignment';
        this.cdr.markForCheck();
      },
    });
  }
}