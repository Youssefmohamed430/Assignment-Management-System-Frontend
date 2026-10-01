import { Component, OnInit } from '@angular/core';
import { InstructorService } from '../../Services/instructor-service';
import { CourseService } from '../../Services/course-service';
import { Instructor } from '../../models/instructor';
import { ICourse } from '../../models/ICourse';
import { FormsModule } from '@angular/forms';
import { ResponseModel } from '../../models/response-model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-course',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse implements OnInit {
  InstructorList: Instructor[] = [];
  Course: ICourse = new ICourse();
  errorMessage = '';
  successMessage = '';

  constructor(
    private instructorService: InstructorService,
    private courseservice: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getInstructors();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.Course.imageFile = input.files[0];
    }
  }

  getInstructors() {
    this.instructorService.getInstructors().subscribe({
      next: (InstructorRes: ResponseModel<Instructor[]>) => {
        this.InstructorList = InstructorRes.result ?? [];
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to load instructors';
      },
    });
  }

  AddCourse() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.Course.imageFile) {
      this.errorMessage = 'Course image is required';
      return;
    }
    this.courseservice.addCourse(this.Course).subscribe({
      next: () => {
        this.successMessage = 'Course created';
        this.router.navigateByUrl('/Courses');
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to add course';
      },
    });
  }
}
