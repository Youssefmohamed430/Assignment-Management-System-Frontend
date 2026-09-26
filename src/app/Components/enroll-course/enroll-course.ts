import { Component } from '@angular/core';
import { CourseService } from '../../Services/course-service';
import { ICourse } from '../../models/ICourse';
import { ResponseModel } from '../../models/response-model';
import { CourseEnrollDto } from '../../models/course-enroll-dto';

@Component({
  selector: 'app-enroll-course',
  imports: [],
  templateUrl: './enroll-course.html',
  styleUrl: './enroll-course.css',
})
export class EnrollCourse {
    CoursesList!: ICourse[] ;
    courseEnrolled : CourseEnrollDto = new CourseEnrollDto;
    constructor(private courseservice: CourseService) { 
      this.getCourses();
    }
  
    EnrollInCourse(id:number,crsName:string) {
      this.courseEnrolled.crsId = id;
      this.courseEnrolled.crsName = crsName;
      this.courseservice.EnrollInCourse(this.courseEnrolled);
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
