import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { AssignmentService } from '../../Services/assignment-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { StudentService } from '../../Services/student-service';
import { AssignmentSubsDetails } from '../../models/assignment-subs-details';
import { ResponseModel } from '../../models/response-model';
import { InstructorService } from '../../Services/instructor-service';
import { StatusBadge } from '../status-badge/status-badge';

@Component({
  selector: 'app-assignment-details',
  imports: [RouterLink, DatePipe, StatusBadge],
  templateUrl: './assignment-details.html',
  styleUrl: './assignment-details.css',
})
export class AssignmentDetails implements OnInit {
  AssignmentList: IAssigment[] = [];
  assignmentFilter: 'active' | 'draft' | 'archived' = 'active';
  public crsid = 0;
  errorMessage = '';
  successMessage = '';
  submitDetails: Record<number, AssignmentSubsDetails> = {};

  get visibleAssignments(): IAssigment[] {
    if (!this.authservice.isInstructor()) return this.AssignmentList;

    return this.AssignmentList.filter((assignment) => {
      const status = assignment.status ?? 1;
      if (this.assignmentFilter === 'draft') return status === 0;
      if (this.assignmentFilter === 'archived') return status === 3;
      return status === 1 || status === 2;
    });
  }

  setAssignmentFilter(value: string): void {
    if (value === 'draft' || value === 'archived' || value === 'active') {
      this.assignmentFilter = value;
    }
  }

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    public authservice: AuthService,
    private studentService: StudentService,
    private instructorService: InstructorService,
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
        const result = res?.result ?? res?.data ?? res;
        const data = Array.isArray(result)
          ? result.sort((a, b) => (b.attemptNumber ?? 0) - (a.attemptNumber ?? 0))[0]
          : result;
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

  changeStatus(id: number, action: 'publish' | 'close' | 'archive'): void {
    const request = action === 'publish' ? this.instructorService.publishAssignment(id)
      : action === 'close' ? this.instructorService.closeAssignment(id)
      : this.instructorService.archiveAssignment(id);
    request.subscribe({
      next: () => { this.successMessage = 'Assignment ' + action + 'd'; this.loadAssignments(); },
      error: (error) => { this.errorMessage = error?.error?.message || 'Could not ' + action + ' assignment'; this.cdr.markForCheck(); },
    });
  }
}
