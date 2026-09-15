import { Component, OnInit } from '@angular/core';
import { ICourse } from '../../models/ICourse';
import { CourseService } from '../../Services/course-service';
import { ActivatedRoute } from '@angular/router';
import { ICategory } from '../../models/ICategory';
import { CategoryService } from '../../Services/category-service';

@Component({
  selector: 'app-edit-course',
  imports: [],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css',
})
export class EditCourse implements OnInit {
  course!:ICourse | undefined;
  CourseId:number = 0;
  CategoryList!:ICategory[];
  constructor(private courseservice:CourseService,private _activatedRoute: ActivatedRoute,private categoryservice: CategoryService) { }

  ngOnInit() {
    this.CourseId = Number(this._activatedRoute.snapshot.params['id']);
    console.log('CourseId:', this.CourseId);
    this.course = this.courseservice.getCourseById(this.CourseId);
    console.log('Course:', this.course);
    this.CategoryList = this.categoryservice.getCategories();
  }
}
