import { Injectable } from '@angular/core';
import { IAssigment } from '../models/iassigment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  AssignmentsList:IAssigment[] = [
    {id:1, title:'Assignment 1', deadline:new Date('2024-06-30'), CourseId: 1},
    {id:2, title:'Assignment 2', deadline:new Date('2024-07-15'), CourseId: 1},
    {id:3, title:'Assignment 3', deadline:new Date('2024-08-01'), CourseId: 2},
    {id:4, title:'Assignment 4', deadline:new Date('2024-08-15'), CourseId: 2},
    {id:5, title:'Assignment 5', deadline:new Date('2024-09-01'), CourseId: 3},
  ]

  public getAssignments(): IAssigment[] {
    return this.AssignmentsList;
  }

  public getAssignmentById(id: number): IAssigment | undefined {
    return this.AssignmentsList.find(assignment => assignment.id === id);
  }

  
  public getAssignmentByCrsId(id: number): IAssigment[] | undefined {
    return this.AssignmentsList.filter(assignment => assignment.CourseId === id);
  }


  public addAssignment(assignment: IAssigment): void {
    this.AssignmentsList.push(assignment);
    // API call to save the assignment in the backend can be made here
  }

  public updateAssignment(updatedAssignment: IAssigment): void {
    // API call to update the assignment in the backend can be made here
  }

  public deleteAssignment(id: number): void {
    // API call to delete the assignment in the backend can be made here
  }
}
