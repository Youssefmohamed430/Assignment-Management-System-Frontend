import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from '../models/submission';
import { ResponseModel } from '../models/response-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubmisiionService {
  constructor(private httpclient: HttpClient) {}

  public submitAssignment(
    assignmentId: number,
    file: File
  ): Observable<ResponseModel<Submission>> {
    const formData = new FormData();
    formData.append('AssignmentId', assignmentId.toString());
    formData.append('File', file);
    return this.httpclient.post<ResponseModel<Submission>>(
      `${environment.baseUrl}/Submisision`,
      formData
    );
  }

  public getSubmissions(
    assignId: number
  ): Observable<ResponseModel<Submission[]>> {
    return this.httpclient.get<ResponseModel<Submission[]>>(
      `${environment.baseUrl}/Submisision/${assignId}`
    );
  }

  public getSubmissionFile(submissionId: number): Observable<Blob> {
    return this.httpclient.get(
      `${environment.baseUrl}/Submisision/file/${submissionId}`,
      { responseType: 'blob' }
    );
  }
}
