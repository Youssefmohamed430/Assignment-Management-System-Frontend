import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentService } from '../../Services/student-service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-details',
  imports: [RouterLink],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit, OnDestroy {
  student: Student | null = null;
  errorMessage = '';
  imageUrl = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    this.studentService.searchStudentByName(name).subscribe({
      next: (res: any) => {
        const data = res?.result ?? res?.data ?? res;
        if (Array.isArray(data)) {
          this.student = data[0] ?? null;
        } else if (data && typeof data === 'object') {
          this.student = data;
        } else {
          this.student = null;
        }
        this.loadProfileImage();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Student not found';
        this.cdr.markForCheck();
      },
    });
  }

  private loadProfileImage(): void {
    const id = this.getStudentId();
    if (!id) return;

    this.studentService.getProfileImage(id).subscribe({
      next: (blob: Blob) => {
        if (this.imageUrl) {
          URL.revokeObjectURL(this.imageUrl);
        }
        this.imageUrl = URL.createObjectURL(blob);
        this.cdr.markForCheck();
      },
      error: () => {
        /* no image, keep placeholder */
      },
    });
  }

  private getStudentId(): string {
    const s: any = this.student;
    const id = s?.id ?? s?.studentId ?? s?.userId ?? '';
    return id ? String(id) : '';
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}