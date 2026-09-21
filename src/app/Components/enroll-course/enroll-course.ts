import { Component } from '@angular/core';
import { CourseService } from '../../Services/course-service';
import { ICourse } from '../../models/ICourse';
import { ResponseModel } from '../../models/response-model';

@Component({
  selector: 'app-enroll-course',
  imports: [],
  templateUrl: './enroll-course.html',
  styleUrl: './enroll-course.css',
})
export class EnrollCourse {
    CoursesList!: ICourse[] ;
    constructor(private courseservice: CourseService) { 
      this.getCourses();
    }
  
    EnrollInCourse(id: number) {
      this.courseservice.EnrollInCourse(id);
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
}
