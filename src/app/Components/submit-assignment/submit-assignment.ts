import { Component } from '@angular/core';
import { Submission } from '../../models/submission';

@Component({
  selector: 'app-submit-assignment',
  imports: [],
  templateUrl: './submit-assignment.html',
  styleUrl: './submit-assignment.css',
})
export class SubmitAssignment {
  Submission!:Submission;
}
