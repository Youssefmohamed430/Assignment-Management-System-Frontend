import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instructor } from '../models/instructor';
import { environment } from '../../environments/environment.development';
import { ResponseModel } from '../models/response-model';
import { ICourse } from '../models/ICourse';

@Injectable({
  providedIn: 'root',
})
export class InstructorService {

  constructor(private httpclient:HttpClient) {}

  public getInstructors() : Observable<ResponseModel<Instructor[]>> {
    return this.httpclient.get<ResponseModel<Instructor[]>>
    (`${environment.baseurl}/Instructor`);
  }

  public getCoursesForInstructor() : Observable<ResponseModel<ICourse[]>> {
      return this.httpclient.get<ResponseModel<ICourse[]>>(
        `${environment.baseurl}/Instructor/InstructorCourses`);
    }
}
