import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../models/instructor';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../models/response-model';
import { ICourse } from '../models/ICourse';
import { AssignmentStudentGrades } from '../models/assignment-student-grades';
import { InstructorDashboardDto } from '../models/dashboard';

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

  public getDashboard(): Observable<ResponseModel<InstructorDashboardDto>> {
    return this.httpclient.get<ResponseModel<InstructorDashboardDto>>(
      `${environment.baseUrl}/Instructor/dashboard`
    );
  }

  public publishAssignment(id: number): Observable<ResponseModel<unknown>> {
    return this.httpclient.patch<ResponseModel<unknown>>(
      `${environment.baseUrl}/Instructor/assignments/${id}/publish`, {}
    );
  }

  public closeAssignment(id: number): Observable<ResponseModel<unknown>> {
    return this.httpclient.patch<ResponseModel<unknown>>(
      `${environment.baseUrl}/Instructor/assignments/${id}/close`, {}
    );
  }

  public archiveAssignment(id: number): Observable<ResponseModel<unknown>> {
    return this.httpclient.patch<ResponseModel<unknown>>(
      `${environment.baseUrl}/Instructor/assignments/${id}/archive`, {}
    );
  }

  public setFeedback(submissionId: number, feedback: string): Observable<ResponseModel<string>> {
    return this.httpclient.put<ResponseModel<string>>(
      `${environment.baseUrl}/Instructor/feedback/${submissionId}`,
      JSON.stringify(feedback),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
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
