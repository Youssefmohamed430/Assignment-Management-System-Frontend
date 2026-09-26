import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../models/response-model';
import { ICourse } from '../models/ICourse';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  StudentList:Student[] = [
    {id:1,name:'Student1',email:'Student1@gmail.com'},
    {id:2,name:'Student2',email:'Student2@gmail.com'},
    {id:3,name:'Student3',email:'Student3@gmail.com'},
    {id:4,name:'Student4',email:'Student4@gmail.com'},
    {id:5,name:'Student5',email:'Student5@gmail.com'},
  ];

  constructor(private httpclient:HttpClient) {}

  getStudents()
  {
    return this.StudentList;
  }

  public GetCourseEnrollments() : Observable<ResponseModel<ICourse[]>>{
    return this.httpclient.get<ResponseModel<ICourse[]>>(`${environment.baseurl}/Student`);
  }

  searchStudents(searchText: string): Student[] {

    if (!searchText.trim()) {
      return this.StudentList;
    }

    return this.StudentList.filter(student =>
      student.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
