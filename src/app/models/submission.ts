import { SubmissionStatus } from './enums';

export class Submission {
  submissionId: number = 0;
  assignmentId: number = 0;
  assignmentTitle: string = '';
  fileName: string = '';
  stuname: string = '';
  grade: number | null = null;
  file?: File;
  attemptNumber = 1;
  submitedAt = '';
  feedback?: string;
  isLate = false;
  status: SubmissionStatus = SubmissionStatus.Pending;
}
