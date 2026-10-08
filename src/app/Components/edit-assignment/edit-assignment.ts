import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssignmentService } from '../../Services/assignment-service';
import { FormsModule } from '@angular/forms';
import { ResponseModel } from '../../models/response-model';

@Component({
  selector: 'app-edit-assignment',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-assignment.html',
  styleUrl: './edit-assignment.css',
})
export class EditAssignment implements OnInit {
  assignment: IAssigment = new IAssigment();
  courseId = 0;
  assignmentId = 0;
  errorMessage = '';

  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.getassignment();
  }

  getassignment() {
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (response: any) => {
        const data = response?.result ?? response?.data ?? response;
        this.assignment = {
          ...data,
          assignmentId: data?.assignmentId ?? data?.id ?? this.assignmentId,
          crsId: data?.crsId ?? data?.courseId ?? this.courseId,
          title: data?.title ?? '',
          deadLine: data?.deadLine || data?.deadline || '',
        };
        if (this.assignment.deadLine) {
          this.assignment.deadLine = new Date(this.assignment.deadLine).toISOString().slice(0, 16);
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Assignment not found';
        this.cdr.markForCheck();
      },
    });
  }

  EditAssignment() {
    this.errorMessage = '';
    this.assignment.assignmentId = this.assignmentId;
    this.assignment.crsId = this.courseId;
    this.assignmentService.updateAssignment(this.assignment).subscribe({
      next: () => {
        this.router.navigate(['/Courses/AssignmentDetails', this.courseId]);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Update failed';
        this.cdr.markForCheck();
      },
    });
  }
}
