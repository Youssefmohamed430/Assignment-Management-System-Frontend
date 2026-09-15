import { Injectable } from '@angular/core';
import { ICategory } from '../models/ICategory';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  CategoryList: ICategory[] = [
    { id: 1, categoryCode: 'C001', categoryName: 'Category 1' },
    { id: 2, categoryCode: 'C002', categoryName: 'Category 2' },
    { id: 3, categoryCode: 'C003', categoryName: 'Category 3' },
    { id: 4, categoryCode: 'C004', categoryName: 'Category 4' },
    { id: 5, categoryCode: 'C005', categoryName: 'Category 5' },
  ];

  public getCategories() {
    return this.CategoryList;
  }
}
