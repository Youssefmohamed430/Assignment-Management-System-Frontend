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
  Course:ICourse = new ICourse ;
  selectedFile?: File;
  constructor(private instructorService:InstructorService,private courseservice:CourseService) { this.getInstructors(); }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }


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
    this.courseservice.addCourse(this.Course).subscribe({
      next: (response) => {
        console.log('Course added successfully', response);
      },
      error: (error) => {
        console.error('Error adding course:', error);
      }
    });
  }
}
