import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from '../../Services/assignment-service';

@Component({
  selector: 'app-edit-assignment',
  imports: [DatePipe],
  templateUrl: './edit-assignment.html',
  styleUrl: './edit-assignment.css',
})
export class EditAssignment {
  assignment!:IAssigment ;

  ngOnInit() {
    // Logic to fetch the assignment details can be implemented here
  }

  public UpdateAssignment(): void {
    // Logic to update the assignment can be implemented here
  }
  constructor(private assignmentService: AssignmentService, private route: ActivatedRoute) {
    this.assignment = assignmentService.getAssignmentById(Number(this.route.snapshot.paramMap.get('id'))) as IAssigment;
  }
}
