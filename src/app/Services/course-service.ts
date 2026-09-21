import { Injectable } from '@angular/core';
import { ICourse } from '../models/ICourse';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../models/course-response';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  CoursesList:ICourse[] = [];
  constructor(private httpclient:HttpClient) {}

  public addCourse(course:ICourse) {
    this.httpclient.post<CourseResponse>(
      `${environment.baseurl}/Course`,
      course
    )
  }

  public getCourses(): Observable<ResponseModel<ICourse[]>> {
    return this.httpclient.get<ResponseModel<ICourse[]>>(
      `${environment.baseurl}/Course`
    );
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
