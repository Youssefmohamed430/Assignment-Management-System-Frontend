import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CourseService } from '../../Services/course-service';
import { ICourse } from '../../models/ICourse';
import { ResponseModel } from '../../models/response-model';
import { CourseEnrollDto } from '../../models/course-enroll-dto';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enroll-course',
  imports: [RouterLink],
  templateUrl: './enroll-course.html',
  styleUrl: './enroll-course.css',
})
export class EnrollCourse implements OnInit, OnDestroy {
  CoursesList: ICourse[] = [];
  courseEnrolled: CourseEnrollDto = new CourseEnrollDto();
  imageUrls: Record<number, string> = {};
  errorMessage = '';
  successMessage = '';

  constructor(
    private courseservice: CourseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCourses();
  }

  ngOnDestroy(): void {
    Object.values(this.imageUrls).forEach((url) => URL.revokeObjectURL(url));
  }

  EnrollInCourse(id: number, crsName: string) {
    this.errorMessage = '';
    this.successMessage = '';
    this.courseEnrolled.crsId = id;
    this.courseEnrolled.crsName = crsName;
    this.courseservice.EnrollInCourse(this.courseEnrolled).subscribe({
      next: (response: ResponseModel<CourseEnrollDto>) => {
        this.successMessage = response.message || `Enrolled in ${crsName}`;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Enrollment failed';
        this.cdr.markForCheck();
      },
    });
  }

  public getCourses() {
    this.courseservice.getCourses().subscribe({
      next: (CourseRes: ResponseModel<ICourse[]>) => {
        this.CoursesList = CourseRes.result ?? [];
        this.CoursesList.forEach((c) => this.loadImage(c.id));
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load courses';
        this.cdr.markForCheck();
      },
    });
  }

  loadImage(courseId: number): void {
    this.courseservice.getCourseImage(courseId).subscribe({
      next: (blob) => {
        if (this.imageUrls[courseId]) {
          URL.revokeObjectURL(this.imageUrls[courseId]);
        }
        this.imageUrls[courseId] = URL.createObjectURL(blob);
        this.cdr.markForCheck();
      },
      error: () => {},
    });
  }
}
