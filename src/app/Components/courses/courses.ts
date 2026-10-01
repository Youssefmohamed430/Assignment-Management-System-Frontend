import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../Services/course-service';
import { AuthService } from '../../Services/auth-service';
import { ResponseModel } from '../../models/response-model';
import { InstructorService } from '../../Services/instructor-service';
import { StudentService } from '../../Services/student-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  imports: [RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit, OnDestroy {
  CoursesList: ICourse[] = [];
  imageUrls: Record<number, string> = {};
  errorMessage = '';
  successMessage = '';

  constructor(
    private courseservice: CourseService,
    public authservice: AuthService,
    public instructorservice: InstructorService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  ngOnDestroy(): void {
    Object.values(this.imageUrls).forEach((url) => URL.revokeObjectURL(url));
  }

  loadCourses(): void {
    let source: Observable<ResponseModel<ICourse[]>>;
    if (this.authservice.isAdmin()) {
      source = this.courseservice.getCourses();
    } else if (this.authservice.isInstructor()) {
      source = this.instructorservice.getCoursesForInstructor();
    } else {
      source = this.studentService.GetCourseEnrollments();
    }
    this.getCourses(source);
  }

  public getCourses(CourseListObservable: Observable<ResponseModel<ICourse[]>>) {
    CourseListObservable.subscribe({
      next: (CourseRes: ResponseModel<ICourse[]>) => {
        this.CoursesList = CourseRes.result ?? [];
        this.CoursesList.forEach((c) => this.loadImage(c.id));
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load courses';
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
      },
      error: () => {
        /* keep placeholder */
      },
    });
  }

  public DeleteCourse(id: number) {
    this.errorMessage = '';
    this.successMessage = '';
    this.courseservice.DeleteCourse(id).subscribe({
      next: () => {
        this.successMessage = 'Course deleted';
        this.loadCourses();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to delete course';
      },
    });
  }
}
