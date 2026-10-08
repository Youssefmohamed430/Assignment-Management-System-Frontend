import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/response-model';
import { ICourse } from '../models/ICourse';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AssignmentSubsDetails } from '../models/assignment-subs-details';
import { StudentDashboardDto } from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private httpclient: HttpClient) {}

  public getDashboard(): Observable<ResponseModel<StudentDashboardDto>> {
    return this.httpclient.get<ResponseModel<StudentDashboardDto>>(
      `${environment.baseUrl}/Student/dashboard`
    );
  }

  public GetCourseEnrollments(): Observable<ResponseModel<ICourse[]>> {
    return this.httpclient.get<ResponseModel<ICourse[]>>(
      `${environment.baseUrl}/Student`
    );
  }

  public getSubmitDetails(
    assignId: number
  ): Observable<ResponseModel<AssignmentSubsDetails[]>> {
    return this.httpclient.get<ResponseModel<AssignmentSubsDetails[]>>(
      `${environment.baseUrl}/Student/SubmitDetails?assignid=${assignId}`
    );
  }

  public searchStudentByName(
    name: string
  ): Observable<ResponseModel<Student>> {
    return this.httpclient.get<ResponseModel<Student>>(
      `${environment.baseUrl}/Student/${encodeURIComponent(name)}`
    );
  }

  public uploadProfileImage(image: File): Observable<ResponseModel<Student>> {
    const formData = new FormData();
    formData.append('Image', image);
    return this.httpclient.put<ResponseModel<Student>>(
      `${environment.baseUrl}/Student/ProfileImage`,
      formData
    );
  }

  public getProfileImage(studentId: string): Observable<Blob> {
    return this.httpclient.get(
      `${environment.baseUrl}/Student/ProfileImage/${studentId}`,
      { responseType: 'blob' }
    );
  }
}
