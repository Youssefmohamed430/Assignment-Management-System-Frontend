import { Injectable } from '@angular/core';
import { ICourse } from '../models/ICourse';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../models/course-response';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { CourseEnrollDto } from '../models/course-enroll-dto';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  CoursesList:ICourse[] = [];
  constructor(private httpclient:HttpClient) {}

  public addCourse(course: ICourse): Observable<CourseResponse> {
    return this.httpclient.post<CourseResponse>(
      `${environment.baseurl}/Course`,
      course
    );
  }

    
  public EditCourse(course: ICourse,id:number): Observable<CourseResponse> {
    return this.httpclient.put<CourseResponse>(
      `${environment.baseurl}/Course/${id}`,
      course
    );
  }

  public getCourses(): Observable<ResponseModel<ICourse[]>> {
    return this.httpclient.get<ResponseModel<ICourse[]>>(
      `${environment.baseurl}/Course`
    );
  }

  public getCourseById(id: number) : Observable<ResponseModel<ICourse>> {
    return this.httpclient.get<ResponseModel<ICourse>>(
      `${environment.baseurl}/Course/${id}`);
  }

  public DeleteCourse(id: number) : Observable<ResponseModel<ICourse>> {
    return this.httpclient.delete<ResponseModel<ICourse>>(`${environment.baseurl}/Courses/${id}`);
  }

  public EnrollInCourse(courseEnrollDto:CourseEnrollDto) {
    return this.httpclient.post<ResponseModel<ICourse>>(`${environment.baseurl}/Courses/EnrollCourse`,courseEnrollDto);
  }
}
