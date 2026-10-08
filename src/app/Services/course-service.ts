import { Injectable } from '@angular/core';
import { ICourse } from '../models/ICourse';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../models/course-response';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { CourseEnrollDto } from '../models/course-enroll-dto';
import { CourseAnnouncement, CreateCourseAnnouncement } from '../models/course-announcement';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  CoursesList: ICourse[] = [];

  constructor(private httpclient: HttpClient) {}

  public addCourse(course: ICourse): Observable<CourseResponse> {
    const formData = new FormData();
    formData.append('CrsName', course.crsName);
    formData.append('InstId', course.instId);
    if (course.imageFile) {
      formData.append('Image', course.imageFile);
    }
    return this.httpclient.post<CourseResponse>(
      `${environment.baseUrl}/Course`,
      formData
    );
  }

  public EditCourse(course: ICourse, id: number): Observable<CourseResponse> {
    const body = {
      crsName: course.crsName,
      instId: course.instId,
    };
    return this.httpclient.put<CourseResponse>(
      `${environment.baseUrl}/Course/${id}`,
      body
    );
  }

  public getCourses(): Observable<ResponseModel<ICourse[]>> {
    return this.httpclient.get<ResponseModel<ICourse[]>>(
      `${environment.baseUrl}/Course`
    );
  }

  public getCourseById(id: number): Observable<ResponseModel<ICourse>> {
    return this.httpclient.get<ResponseModel<ICourse>>(
      `${environment.baseUrl}/Course/${id}`
    );
  }

  public DeleteCourse(id: number): Observable<ResponseModel<ICourse>> {
    return this.httpclient.delete<ResponseModel<ICourse>>(
      `${environment.baseUrl}/Course/${id}`
    );
  }

  public EnrollInCourse(
    courseEnrollDto: CourseEnrollDto
  ): Observable<ResponseModel<CourseEnrollDto>> {
    return this.httpclient.post<ResponseModel<CourseEnrollDto>>(
      `${environment.baseUrl}/Course/EnrollCourse`,
      courseEnrollDto
    );
  }

  public getCourseImage(id: number): Observable<Blob> {
    return this.httpclient.get(`${environment.baseUrl}/Course/Image/${id}`, {
      responseType: 'blob',
    });
  }

  public getCourseAnnouncements(courseId: number): Observable<ResponseModel<CourseAnnouncement[]>> {
    return this.httpclient.get<ResponseModel<CourseAnnouncement[]>>(
      environment.baseUrl + '/Course/' + courseId + '/announcements'
    );
  }

  public createCourseAnnouncement(
    courseId: number,
    announcement: CreateCourseAnnouncement
  ): Observable<ResponseModel<CourseAnnouncement>> {
    return this.httpclient.post<ResponseModel<CourseAnnouncement>>(
      environment.baseUrl + '/Course/' + courseId + '/announcements',
      announcement
    );
  }
}
