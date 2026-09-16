import { Injectable } from '@angular/core';
import { ICourse } from '../models/ICourse';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  CoursesList:ICourse[] = [
    {id:1, CourseCode:'C001', name:'Course 1', description:'This is course 1', Category:'Category 1'},
    {id:2, CourseCode:'C002', name:'Course 2', description:'This is course 2', Category:'Category 2'},
    {id:3, CourseCode:'C003', name:'Course 3', description:'This is course 3', Category:'Category 3'},
    {id:4, CourseCode:'C004', name:'Course 4', description:'This is course 4', Category:'Category 4'},
    {id:5, CourseCode:'C005', name:'Course 5', description:'This is course 5', Category:'Category 5'},
  ];

  public getCourses() : ICourse[] {
    return this.CoursesList;
  }

  public getCourseById(id: number) : ICourse | undefined  {
    return this.CoursesList.find(course => course.id === id);
  }

  public DeleteCourse(id: number) {
    // Call the API to delete the course with the given id
  }

  public EnrollInCourse(id: number) {
    // Call the API to enroll in the course with the given id
  }
}
