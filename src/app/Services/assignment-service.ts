import { Injectable } from '@angular/core';
import { IAssigment } from '../models/iassigment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  AssignmentsList:IAssigment[] = [];
  
    constructor(private httpclient:HttpClient) {}

  public getAssignmentByCrsId(id:number): Observable<ResponseModel<IAssigment[]>> {
    return this.httpclient.get<ResponseModel<IAssigment[]>>(`${environment.baseurl}/Assignment/${id}`)
  }

  public getAssignmentFile(id: number): Observable<Blob> {
    return this.httpclient.get(
      `${environment.baseurl}/Instructor/file/${id}`,
      {
        responseType: 'blob'
      }
    );
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
