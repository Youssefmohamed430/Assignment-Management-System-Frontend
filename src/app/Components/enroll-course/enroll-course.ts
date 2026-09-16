import { Component } from '@angular/core';
import { CourseService } from '../../Services/course-service';
import { ICourse } from '../../models/ICourse';

@Component({
  selector: 'app-enroll-course',
  imports: [],
  templateUrl: './enroll-course.html',
  styleUrl: './enroll-course.css',
})
export class EnrollCourse {
    CoursesList!: ICourse[] ;
    constructor(private courseservice: CourseService) { 
      this.CoursesList = this.courseservice.getCourses();
    }
  
    EnrollInCourse(id: number) {
      this.courseservice.EnrollInCourse(id);
      this.CoursesList = this.courseservice.getCourses();
    }
}
