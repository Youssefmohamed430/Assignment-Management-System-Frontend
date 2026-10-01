import { Component } from '@angular/core';
import { Student } from '../../models/student';
import { StudentService } from '../../Services/student-service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-studentspage',
  imports: [FormsModule, RouterLink],
  templateUrl: './studentspage.html',
  styleUrl: './studentspage.css',
})
export class Studentspage {
  studentList: Student[] = [];
  searchText = '';
  errorMessage = '';
  searched = false;

  constructor(private studentservice: StudentService) {}

  searchStudents(): void {
    this.errorMessage = '';
    this.searched = true;
    const name = this.searchText.trim();
    if (!name) {
      this.studentList = [];
      this.errorMessage = 'Enter a student name to search';
      return;
    }

    this.studentservice.searchStudentByName(name).subscribe({
      next: (res) => {
        if (res.result) {
          this.studentList = [res.result];
        } else {
          this.studentList = [];
        }
      },
      error: (error) => {
        this.studentList = [];
        this.errorMessage =
          error?.error?.message || 'Student not found';
      },
    });
  }

  onSearchInput(): void {
    if (!this.searchText.trim()) {
      this.studentList = [];
      this.searched = false;
      this.errorMessage = '';
    }
  }
}
