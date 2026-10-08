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
    const navStudent = history.state?.student;
    if (navStudent && typeof navStudent === 'object') {
      this.student = navStudent;
      this.loadProfileImage();
      this.cdr.markForCheck();
      return;
    }

    const name = this.route.snapshot.paramMap.get('name') ?? '';
    if (!name) return;

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
    const s: any = this.student;
    if (!s) return;

    const studentId = this.getStudentId();
    if (!studentId) return;

    this.studentService.getProfileImage(studentId).subscribe({
      next: (blob: Blob) => {
        if (blob && blob.size > 0) {
          if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(this.imageUrl);
          }
          this.imageUrl = URL.createObjectURL(blob);
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.imageUrl = '';
        this.cdr.markForCheck();
      },
    });
  }

  private getStudentId(): string {
    const s: any = this.student;
    const id =
      s?.id ??
      s?.Id ??
      s?.studentId ??
      s?.StudentId ??
      s?.userId ??
      s?.UserId ??
      '';
    return id ? String(id) : '';
  }

  onImageError(): void {
    this.imageUrl = '';
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}