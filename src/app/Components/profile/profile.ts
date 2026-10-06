import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { StudentService } from '../../Services/student-service';
import { InstructorService } from '../../Services/instructor-service';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, UpperCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  imageUrl = '';
  errorMessage = '';
  successMessage = '';
  username = '';
  email = '';
  role = '';

  constructor(
    public authservice: AuthService,
    private studentService: StudentService,
    private instructorService: InstructorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authservice.getStoredUser();
    this.username = user?.username ?? '';
    this.email = user?.email ?? '';
    this.role = this.authservice.getRole();
    this.loadProfileImage();
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }

  loadProfileImage(): void {
    const id = this.authservice.getUserId();
    if (!id) {
      return;
    }

    const request = this.authservice.isStudent()
      ? this.studentService.getProfileImage(id)
      : this.instructorService.getProfileImage(id);

    request.subscribe({
      next: (blob) => {
        if (this.imageUrl) {
          URL.revokeObjectURL(this.imageUrl);
        }
        this.imageUrl = URL.createObjectURL(blob);
        this.cdr.markForCheck();
      },
      error: () => {
        /* no image yet */
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) {
      return;
    }
    const file = input.files[0];
    this.errorMessage = '';
    this.successMessage = '';

    if (this.authservice.isStudent()) {
      this.studentService.uploadProfileImage(file).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Profile image updated';
          this.cdr.markForCheck();
          this.loadProfileImage();
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Failed to upload image';
          this.cdr.markForCheck();
        },
      });
    } else {
      this.instructorService.uploadProfileImage(file).subscribe({
        next: (res) => {
          this.successMessage = res.message || 'Profile image updated';
          this.cdr.markForCheck();
          this.loadProfileImage();
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Failed to upload image';
          this.cdr.markForCheck();
        },
      });
    }
  }
}
