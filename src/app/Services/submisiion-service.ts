import { Injectable } from '@angular/core';
import { Submission } from '../models/submission';

@Injectable({
  providedIn: 'root',
})
export class SubmisiionService {
    submissionList:Submission[] = [
      {id:1,AssignmentId:2,StudentId:1,filename:'file1',SubmitDate:new Date()},
      {id:2,AssignmentId:2,StudentId:2,filename:'file2',SubmitDate:new Date()},
      {id:3,AssignmentId:2,StudentId:2,filename:'file3',SubmitDate:new Date()},
      {id:4,AssignmentId:2,StudentId:3,filename:'file4',SubmitDate:new Date()},
      {id:5,AssignmentId:2,StudentId:3,filename:'file5',SubmitDate:new Date()},
    ];
    
    getSubmissions(){
      return this.submissionList;
    }
}
