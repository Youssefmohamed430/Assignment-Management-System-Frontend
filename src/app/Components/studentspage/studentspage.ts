import { ChangeDetectorRef, Component } from '@angular/core';
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

  constructor(
    private studentservice: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

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
      next: (res: any) => {
        const data = res?.result ?? res?.data ?? res;
        if (Array.isArray(data)) {
          this.studentList = data;
        } else if (data && typeof data === 'object') {
          this.studentList = [data];
        } else {
          this.studentList = [];
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.studentList = [];
        this.errorMessage =
          error?.error?.message || 'Student not found';
        this.cdr.markForCheck();
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
