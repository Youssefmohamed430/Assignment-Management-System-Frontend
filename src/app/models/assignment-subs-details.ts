export interface AssignmentSubsDetails {
  title: string;
  deadLine: string;
  fileName: string;
  grade: number | null;
  feedback?: string | null;
  attemptNumber?: number;
  submitedAt?: string;
}
