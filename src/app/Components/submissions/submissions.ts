import { Component } from '@angular/core';
import { Submission } from '../../models/submission';
import { SubmisiionService } from '../../Services/submisiion-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-submissions',
  imports: [DatePipe],
  templateUrl: './submissions.html',
  styleUrl: './submissions.css',
})
export class Submissions {
  submission!:Submission;
  submissionList!:Submission[];

  constructor(private Submissionservice:SubmisiionService) {
      this.submissionList = this.Submissionservice.getSubmissions();
  }

  ViewFile(id:number){
    // Get Submit File
  }
}
