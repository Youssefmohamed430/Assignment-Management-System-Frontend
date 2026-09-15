import { Component } from '@angular/core';
import { ICategory } from '../../models/ICategory';

@Component({
  selector: 'app-add-course',
  imports: [],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse {
  CategoriesList: ICategory[] = [
    {id:1, categoryCode:'CAT001', categoryName:'Category 1'},
    {id:2, categoryCode:'CAT002', categoryName:'Category 2'},
    {id:3, categoryCode:'CAT003', categoryName:'Category 3'},
    {id:4, categoryCode:'CAT004', categoryName:'Category 4'},
    {id:5, categoryCode:'CAT005', categoryName:'Category 5'},
  ];
}
