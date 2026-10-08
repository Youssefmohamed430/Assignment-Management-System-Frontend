import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth-service';
import { StudentService } from '../../Services/student-service';
import { InstructorService } from '../../Services/instructor-service';
import { RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

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
    const user: any = this.authservice.getStoredUser();
    const id = this.authservice.getUserId();
    const idsToTry: string[] = [];

    const pushIfValid = (val: any) => {
      if (val !== undefined && val !== null && val !== '') {
        const strVal = String(val);
        if (!idsToTry.includes(strVal)) idsToTry.push(strVal);
      }
    };

    pushIfValid(id);
    pushIfValid(user?.id);
    pushIfValid(user?.iD);
    pushIfValid(user?.Id);
    pushIfValid(user?.studentId);
    pushIfValid(user?.instructorId);
    pushIfValid(user?.username);
    pushIfValid(user?.userName);
    pushIfValid(user?.imageName);

    const isStudent = this.authservice.isStudent();

    const tryNext = (index: number) => {
      if (index >= idsToTry.length) {
        const imgName = user?.imageName || user?.ImageName;
        if (imgName) {
          const rootUrl = environment.baseUrl.replace(/\/api\/?$/, '');
          this.imageUrl = `${rootUrl}/images/${imgName}`;
          this.cdr.markForCheck();
        }
        return;
      }

      const currentId = idsToTry[index];
      const request = isStudent
        ? this.studentService.getProfileImage(currentId)
        : this.instructorService.getProfileImage(currentId);

      request.subscribe({
        next: (blob: Blob) => {
          if (blob && blob.size > 0) {
            if (this.imageUrl && this.imageUrl.startsWith('blob:')) {
              URL.revokeObjectURL(this.imageUrl);
            }
            this.imageUrl = URL.createObjectURL(blob);
            this.cdr.markForCheck();
          } else {
            tryNext(index + 1);
          }
        },
        error: () => {
          tryNext(index + 1);
        },
      });
    };

    if (idsToTry.length > 0) {
      tryNext(0);
    }
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
