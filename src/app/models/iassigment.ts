import { AssignmentStatus } from './enums';

export class IAssigment {
  assignmentId: number = 0;
  title: string = '';
  deadLine: string = '';
  deadline?: string = '';
  crsId: number = 0;
  crsName?: string = '';
  fileName?: string = '';
  assignmentFile?: File;
  status?: AssignmentStatus;
  publishedAt?: string | null;
  closedAt?: string | null;
}
