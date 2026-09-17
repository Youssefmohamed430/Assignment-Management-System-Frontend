import { Component} from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { AssignmentService } from '../../Services/assignment-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';


@Component({
  selector: 'app-assignment-details',
  imports: [RouterLink,DatePipe],
  templateUrl: './assignment-details.html',
  styleUrl: './assignment-details.css',
})
export class AssignmentDetails {
  AssignmentList:IAssigment[] | undefined;
  CourseId: number = 0;

  constructor(private assignmentService: AssignmentService,private route: ActivatedRoute,public authservice:AuthService) { }

  ngOnInit() {
    this.CourseId = Number(this.route.snapshot.paramMap.get('id'));
    this.AssignmentList = this.assignmentService.getAssignmentByCrsId(this.CourseId);
  }

  public DeleteAssignment(assignmentId: number): void {
    this.assignmentService.deleteAssignment(assignmentId);
    this.AssignmentList = this.assignmentService.getAssignmentByCrsId(this.CourseId);
  }
}
