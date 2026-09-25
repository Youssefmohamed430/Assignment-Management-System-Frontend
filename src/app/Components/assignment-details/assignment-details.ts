import { Component} from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { AssignmentService } from '../../Services/assignment-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../Services/auth-service';
import { ResponseModel } from '../../models/response-model';


@Component({
  selector: 'app-assignment-details',
  imports: [RouterLink,DatePipe],
  templateUrl: './assignment-details.html',
  styleUrl: './assignment-details.css',
})
export class AssignmentDetails {
  AssignmentList:IAssigment[] | undefined;
  public crsid:number = 0;

  constructor(private assignmentService: AssignmentService,private route: ActivatedRoute,public authservice:AuthService) { 
    this.crsid = Number(this.route.snapshot.params['id']);
    this.assignmentService.getAssignmentByCrsId(this.crsid).subscribe({

      next: (response : ResponseModel<IAssigment[]>) => {
        this.AssignmentList = response.result;
        console.log(this.AssignmentList)
      },
      
      error: (error) => {
          console.log("Assignments Not Found");
          console.error(error);
        }
    });
  }

  ViewAssignmentFile(id: number): void {
    console.log(id);
    this.assignmentService.getAssignmentFile(id).subscribe({
      next: (fileBlob: Blob) => {
        const fileUrl = URL.createObjectURL(fileBlob);

        window.open(fileUrl, '_blank');

        setTimeout(() => {
          URL.revokeObjectURL(fileUrl);
        }, 1000);
      },

      error: (error) => {
        console.log("Assignment File Not Found");
        console.error(error);
      }
    });
  }

  public DeleteAssignment(assignmentId: number): void {
    this.assignmentService.deleteAssignment(assignmentId);
    // this.AssignmentList = this.assignmentService.getAssignmentByCrsId(this.CourseId);
  }
}
