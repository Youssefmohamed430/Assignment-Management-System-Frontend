import { Component } from '@angular/core';
import { IAssigment } from '../../models/iassigment';

@Component({
  selector: 'app-add-assignment',
  imports: [],
  templateUrl: './add-assignment.html',
  styleUrl: './add-assignment.css',
})
export class AddAssignment {
  Iassignment:IAssigment = {
    id: 0,
    title: '',
    deadline: new Date(),
    CourseId: 0,
  };

  constructor() {}

  public AddAssignment(): void {
    // Logic to add the assignment can be implemented here
  }

  ngOnInit() {}
}
