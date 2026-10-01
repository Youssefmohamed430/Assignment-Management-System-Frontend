import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterUser } from '../../models/register-user';
import { AuthService } from '../../Services/auth-service';
import { AuthResponse } from '../../models/auth-response';

@Component({
  selector: 'app-register-student',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-student.html',
  styleUrl: './register-student.css',
})
export class RegisterStudent {
  registeredUser: RegisterUser = new RegisterUser();
  errorMessage = '';
  successMessage = '';

  constructor(
    private authservice: AuthService,
    private router: Router
  ) {
    this.registeredUser.role = 'Student';
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.authservice.registerStudent(this.registeredUser).subscribe({
      next: (response: AuthResponse) => {
        if (response.isAuthenticated || response.message) {
          this.successMessage =
            response.message || 'Student registered successfully';
          this.registeredUser = new RegisterUser();
          this.registeredUser.role = 'Student';
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || error?.error?.Message || 'Registration failed';
      },
    });
  }
}
