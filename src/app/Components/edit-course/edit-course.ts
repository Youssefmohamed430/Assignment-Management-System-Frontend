import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { CourseService } from '../../Services/course-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InstructorService } from '../../Services/instructor-service';
import { Instructor } from '../../models/instructor';
import { ResponseModel } from '../../models/response-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-course',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css',
})
export class EditCourse implements OnInit {
  course: ICourse = new ICourse();
  CourseId = 0;
  InstructorList: Instructor[] = [];
  errorMessage = '';
  successMessage = '';

  constructor(
    private courseservice: CourseService,
    private _activatedRoute: ActivatedRoute,
    private instructorservice: InstructorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.CourseId = Number(this._activatedRoute.snapshot.params['id']);
    this.getCourseById();
    this.instructorservice.getInstructors().subscribe({
      next: (InstructorRes: ResponseModel<Instructor[]>) => {
        this.InstructorList = InstructorRes.result ?? [];
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load instructors';
      },
    });
  }

  getCourseById() {
    this.courseservice.getCourseById(this.CourseId).subscribe({
      next: (response: ResponseModel<ICourse>) => {
        this.course = response.result;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load course';
      },
    });
  }

  EditCourse() {
    this.errorMessage = '';
    this.courseservice.EditCourse(this.course, this.CourseId).subscribe({
      next: () => {
        this.successMessage = 'Course updated';
        this.router.navigateByUrl('/Courses');
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to update course';
      },
    });
  }
}
