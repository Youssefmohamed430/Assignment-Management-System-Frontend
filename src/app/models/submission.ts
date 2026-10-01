export class Submission {
  submissionId: number = 0;
  assignmentId: number = 0;
  assignmentTitle: string = '';
  fileName: string = '';
  stuname: string = '';
  grade: number | null = null;
  file?: File;
}
