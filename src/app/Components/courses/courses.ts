import { Component } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../Services/course-service';

@Component({
  selector: 'app-courses',
  imports: [RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {

  CoursesList!: ICourse[] ;
  constructor(private courseservice: CourseService) { 
    this.CoursesList = this.courseservice.getCourses();
  }

  DeleteCourse(id: number) {
    this.courseservice.DeleteCourse(id);
    this.CoursesList = this.courseservice.getCourses();
  }
}
