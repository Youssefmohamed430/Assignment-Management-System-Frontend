import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StudentService } from '../../Services/student-service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-details',
  imports: [RouterLink],
  templateUrl: './student-details.html',
  styleUrl: './student-details.css',
})
export class StudentDetails implements OnInit, OnDestroy {
  student: Student | null = null;
  errorMessage = '';
  imageUrl = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    this.studentService.searchStudentByName(name).subscribe({
      next: (res) => {
        this.student = res.result;
        // Backend UserDto has no id; profile image needs id — skip if unavailable
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Student not found';
      },
    });
  }

  ngOnDestroy(): void {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
