import { ChangeDetectorRef, Component } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../Services/assignment-service';
import { ResponseModel } from '../../models/response-model';
import { AssignmentStatus } from '../../models/enums';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-assignment',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-assignment.html',
  styleUrl: './add-assignment.css',
})
export class AddAssignment {
  assignment: IAssigment = Object.assign(new IAssigment(), { status: AssignmentStatus.Published });
  errorMessage = '';
  courseId = 0;

  constructor(
    private assignmentservice: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.courseId = Number(this.route.snapshot.params['id']);
  }

  public AddAssignment() {
    this.errorMessage = '';
    this.assignment.crsId = this.courseId;
    this.assignment.status ??= AssignmentStatus.Published;
    if (!this.assignment.assignmentFile) {
      this.errorMessage = 'Assignment file is required';
      return;
    }
    this.assignmentservice.addAssignment(this.assignment).subscribe({
      next: (_response: ResponseModel<IAssigment>) => {
        this.router.navigate(['/Courses/AssignmentDetails', this.courseId]);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to add assignment';
        this.cdr.markForCheck();
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.assignment.assignmentFile = input.files[0];
    }
  }
}
