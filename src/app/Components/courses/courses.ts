import { Component } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CourseService } from '../../Services/course-service';
import { AuthService } from '../../Services/auth-service';
import { ResponseModel } from '../../models/response-model';
import { InstructorService } from '../../Services/instructor-service';
import { StudentService } from '../../Services/student-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-courses',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {
  CoursesList!: ICourse[] ;
  constructor(private courseservice: CourseService,public authservice:AuthService,
              public instructorservice:InstructorService,private studentService:StudentService) { 
    if(authservice.isAdmin()) { this.getCourses(this.courseservice.getCourses()); }
    else if(authservice.isInstructor()) { this.getCourses(this.instructorservice.getCoursesForInstructor()); }
    else { this.getCourses(this.studentService.GetCourseEnrollments()); }
  }

    public getCourses(CourseListObservable:Observable<ResponseModel<ICourse[]>>) {
      CourseListObservable.subscribe({
        next: (CourseRes: ResponseModel<ICourse[]>) => {

          this.CoursesList = CourseRes.result;
          console.log(this.CoursesList);
        },

        error: (error) => {
          console.log("Courses Not Found");
          console.error(error);
        }
      });
    }

  public DeleteCourse(id: number) {
    this.courseservice.DeleteCourse(id).subscribe({
      next : (response) => {
        // Navigate to Courses Page
      },

      error : (error) => {
        console.log("Deleted Course Failed");
        console.error(error);
      }
    });
  }
}
