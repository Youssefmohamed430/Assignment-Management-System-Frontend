import { Injectable } from '@angular/core';
import { IAssigment } from '../models/iassigment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/response-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  AssignmentsList: IAssigment[] = [];

  constructor(private httpclient: HttpClient) {}

  public getAssignmentByCrsId(
    id: number
  ): Observable<ResponseModel<IAssigment[]>> {
    return this.httpclient.get<ResponseModel<IAssigment[]>>(
      `${environment.baseUrl}/Assignment/${id}`
    );
  }

  public getAssignmentById(
    id: number
  ): Observable<ResponseModel<IAssigment>> {
    return this.httpclient.get<ResponseModel<IAssigment>>(
      `${environment.baseUrl}/Assignment/ById/${id}`
    );
  }

  public getAssignmentFile(id: number): Observable<Blob> {
    return this.httpclient.get(
      `${environment.baseUrl}/Instructor/file/${id}`,
      { responseType: 'blob' }
    );
  }

  public addAssignment(
    assignment: IAssigment
  ): Observable<ResponseModel<IAssigment>> {
    const formData = new FormData();
    formData.append('Title', assignment.title);
    formData.append('DeadLine', this.toIsoDateTime(assignment.deadLine));
    formData.append('CrsId', assignment.crsId.toString());
    if (assignment.status !== undefined) formData.append('Status', String(assignment.status));
    if (assignment.assignmentFile) {
      formData.append('File', assignment.assignmentFile);
    }
    return this.httpclient.post<ResponseModel<IAssigment>>(
      `${environment.baseUrl}/Instructor`,
      formData
    );
  }

  public updateAssignment(
    updatedAssignment: IAssigment
  ): Observable<ResponseModel<IAssigment>> {
    const body = {
      title: updatedAssignment.title,
      deadLine: this.toIsoDateTime(updatedAssignment.deadLine),
      crsId: updatedAssignment.crsId,
      status: updatedAssignment.status,
    };
    return this.httpclient.put<ResponseModel<IAssigment>>(
      `${environment.baseUrl}/Assignment/${updatedAssignment.assignmentId}`,
      body
    );
  }

  public deleteAssignment(
    id: number
  ): Observable<ResponseModel<IAssigment>> {
    return this.httpclient.delete<ResponseModel<IAssigment>>(
      `${environment.baseUrl}/Assignment/${id}`
    );
  }

  private toIsoDateTime(value: string): string {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  }
}
