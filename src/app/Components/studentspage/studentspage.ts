import { Component } from '@angular/core';
import { Student } from '../../models/student';
import { StudentService } from '../../Services/student-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-studentspage',
  imports: [FormsModule,RouterLink],
  templateUrl: './studentspage.html',
  styleUrl: './studentspage.css',
})
export class Studentspage {
  student!:Student;
  studentList!:Student[];
  searchText: string = '';

  constructor(private studentservice:StudentService)
  {
    this.studentList = this.studentservice.getStudents();
  }

  searchStudents(): void {
    
    this.studentList =
      this.studentservice.searchStudents(this.searchText);

  }

onSearchInput(): void {
  if (!this.searchText.trim()) {
    this.studentList = this.studentservice.getStudents();
  }
}

  viewStudent(studentId: number): void {
    console.log('View Student:', studentId);
  }
}
