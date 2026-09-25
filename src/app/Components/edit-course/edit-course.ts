import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { CourseService } from '../../Services/course-service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../models/ICategory';
import { CategoryService } from '../../Services/category-service';
import { InstructorService } from '../../Services/instructor-service';
import { Instructor } from '../../models/instructor';
import { ResponseModel } from '../../models/response-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-course',
  imports: [FormsModule],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css',
})
export class EditCourse implements OnInit {
  course!:ICourse;
  CourseId:number = 0;
  InstructorList!:Instructor[];
  constructor(private courseservice:CourseService,private _activatedRoute: ActivatedRoute,private instructorservice: InstructorService) { }

  ngOnInit() {
    this.CourseId = Number(this._activatedRoute.snapshot.params['id']);
    console.log('CourseId:', this.CourseId);
    this.getCourseById();
    console.log('Course:', this.course);
     this.instructorservice.getInstructors().subscribe({
              next: (InstructorRes: ResponseModel<Instructor[]>) => {
                this.InstructorList = InstructorRes.result;
              },
    
              error: (error) => {
                console.error('Error getting instructors:', error);
              }
       });
  }

  getCourseById() {
     let id = Number(this._activatedRoute.snapshot.params['id']);
    this.courseservice.getCourseById(id).subscribe({
        next : (response : ResponseModel<ICourse>) => {
            this.course = response.result ;
        },

        error: (error) => {
                console.error('Error getting Course:', error);
        }
    });
  }

  EditCourse() {
     let id = Number(this._activatedRoute.snapshot.params['id']);
      this.courseservice.EditCourse(this.course,id).subscribe({
        next : (response) => {
            // Navigate to Courses Page
        },
        error: (error) => {
                console.error('Error Editing Course:', error);
        }
      })
  }
}
