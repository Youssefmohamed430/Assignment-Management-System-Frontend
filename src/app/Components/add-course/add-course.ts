import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../models/ICategory';
import { InstructorService } from '../../Services/instructor-service';
import { CourseService } from '../../Services/course-service';
import { Instructor } from '../../models/instructor';
import { ICourse } from '../../models/ICourse';
import { FormsModule } from '@angular/forms';
import { ResponseModel } from '../../models/response-model';

@Component({
  selector: 'app-add-course',
  imports: [FormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse {
  InstructorList!:Instructor[];
  Course!:ICourse;
  constructor(private instructorService:InstructorService,private courseservice:CourseService) { this.getInstructors(); }

  getInstructors() {
    this.instructorService.getInstructors().subscribe({
          next: (InstructorRes: ResponseModel<Instructor[]>) => {
            this.InstructorList = InstructorRes.result;
          },

          error: (error) => {
            console.error('Error getting instructors:', error);
          }
      });
  }

  

  AddCourse() {

  }
}
