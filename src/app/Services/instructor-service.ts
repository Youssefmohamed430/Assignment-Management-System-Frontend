import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../models/instructor';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../models/response-model';
import { ICourse } from '../models/ICourse';
import { AssignmentStudentGrades } from '../models/assignment-student-grades';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  constructor(private httpclient: HttpClient) {}

  public getInstructors(): Observable<ResponseModel<Instructor[]>> {
    return this.httpclient.get<ResponseModel<Instructor[]>>(
      `${environment.baseUrl}/Instructor`
    );
  }

  public getCoursesForInstructor(): Observable<ResponseModel<ICourse[]>> {
    return this.httpclient.get<ResponseModel<ICourse[]>>(
      `${environment.baseUrl}/Instructor/InstructorCourses`
    );
  }

  public setGrade(
    subId: number,
    grade: number
  ): Observable<ResponseModel<unknown>> {
    return this.httpclient.put<ResponseModel<unknown>>(
      `${environment.baseUrl}/Instructor?Subid=${subId}&grade=${grade}`,
      {}
    );
  }

  public getAssignmentGrades(
    assignmentId: number
  ): Observable<ResponseModel<AssignmentStudentGrades[]>> {
    return this.httpclient.get<ResponseModel<AssignmentStudentGrades[]>>(
      `${environment.baseUrl}/Instructor/${assignmentId}`
    );
  }

  public uploadProfileImage(image: File): Observable<ResponseModel<Instructor>> {
    const formData = new FormData();
    formData.append('Image', image);
    return this.httpclient.put<ResponseModel<Instructor>>(
      `${environment.baseUrl}/Instructor/ProfileImage`,
      formData
    );
  }

  public getProfileImage(instructorId: string): Observable<Blob> {
    return this.httpclient.get(
      `${environment.baseUrl}/Instructor/ProfileImage/${instructorId}`,
      { responseType: 'blob' }
    );
  }
}
