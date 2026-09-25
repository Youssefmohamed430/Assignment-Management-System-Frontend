import { Component } from '@angular/core';
import { IAssigment } from '../../models/iassigment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-assignment',
  imports: [FormsModule],
  templateUrl: './add-assignment.html',
  styleUrl: './add-assignment.css',
})
export class AddAssignment {
  assignment:IAssigment = new IAssigment();

  constructor() {}

  public AddAssignment(): void {
    // Logic to add the assignment can be implemented here
  }

  ngOnInit() {}
}
