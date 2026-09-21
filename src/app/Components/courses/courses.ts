import { Component } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CourseService } from '../../Services/course-service';
import { AuthService } from '../../Services/auth-service';
import { ResponseModel } from '../../models/response-model';

@Component({
  selector: 'app-courses',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  CoursesList!: ICourse[] ;
  constructor(private courseservice: CourseService,public authservice:AuthService) { 
    this.getCourses();
  }

    public getCourses() {
      this.courseservice.getCourses().subscribe({
        next: (CourseRes: ResponseModel<ICourse[]>) => {

          this.CoursesList = CourseRes.result;

        },

        error: (error) => {
          console.log("Courses Not Found");
          console.error(error);
        }
      });
    }

  DeleteCourse(id: number) {
    this.courseservice.DeleteCourse(id);
    // this.CoursesList = this.courseservice.getCourses();
  }
}
