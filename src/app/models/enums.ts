export enum AssignmentStatus {
  Draft = 0,
  Published = 1,
  Closed = 2,
  Archived = 3,
}

export enum SubmissionStatus {
  Pending = 0,
  Graded = 1,
  Late = 2,
  Resubmitted = 3,
}

export const assignmentStatusLabel = (status?: AssignmentStatus | number): string =>
  AssignmentStatus[status ?? AssignmentStatus.Published] ?? 'Published';

export const submissionStatusLabel = (status?: SubmissionStatus | number): string =>
  SubmissionStatus[status ?? SubmissionStatus.Pending] ?? 'Pending';
