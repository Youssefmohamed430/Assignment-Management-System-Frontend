import { Component } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CourseService } from '../../Services/course-service';
import { adminguardGuard } from '../../guards/adminguard-guard';
import { AuthService } from '../../Services/auth-service';

@Component({
  selector: 'app-courses',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  CoursesList!: ICourse[] ;
  constructor(private courseservice: CourseService,public authservice:AuthService) { 
    this.CoursesList = this.courseservice.getCourses();
  }

  DeleteCourse(id: number) {
    this.courseservice.DeleteCourse(id);
    this.CoursesList = this.courseservice.getCourses();
  }
}
