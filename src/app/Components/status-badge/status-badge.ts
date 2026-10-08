import { Component, Input } from '@angular/core';
import { AssignmentStatus, SubmissionStatus, assignmentStatusLabel, submissionStatusLabel } from '../../models/enums';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: '<span [class]="badgeClass">{{ label }}</span>',
})
export class StatusBadge {
  @Input() status: AssignmentStatus | SubmissionStatus | number = 0;
  @Input() kind: 'assignment' | 'submission' = 'assignment';

  get label(): string {
    return this.kind === 'assignment'
      ? assignmentStatusLabel(this.status as AssignmentStatus)
      : submissionStatusLabel(this.status as SubmissionStatus);
  }

  get badgeClass(): string {
    const styles: Record<string, string> = {
      Draft: 'badge text-bg-secondary', Published: 'badge text-bg-success',
      Closed: 'badge text-bg-warning', Archived: 'badge text-bg-dark',
      Pending: 'badge text-bg-primary', Graded: 'badge text-bg-success',
      Late: 'badge text-bg-danger', Resubmitted: 'badge text-bg-info',
    };
    return styles[this.label] ?? 'badge text-bg-secondary';
  }
}
