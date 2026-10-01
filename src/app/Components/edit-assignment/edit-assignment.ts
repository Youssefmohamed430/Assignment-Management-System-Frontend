import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    private router: Router
  ) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.assignmentId = Number(this.route.snapshot.paramMap.get('assignmentId'));
    this.getassignment();
  }

  getassignment() {
    this.assignmentService.getAssignmentById(this.assignmentId).subscribe({
      next: (response: ResponseModel<IAssigment>) => {
        this.assignment = response.result;
        if (this.assignment.deadLine) {
          this.assignment.deadLine = String(this.assignment.deadLine).substring(
            0,
            10
          );
        }
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Assignment not found';
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
      },
    });
  }
}
