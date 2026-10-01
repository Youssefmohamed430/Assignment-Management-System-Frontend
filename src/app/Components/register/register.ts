import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterUser } from '../../models/register-user';
import { AuthService } from '../../Services/auth-service';
import { AuthResponse } from '../../models/auth-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registeredUser: RegisterUser = new RegisterUser();
  errorMessage = '';

  constructor(
    private authservice: AuthService,
    private router: Router
  ) {}

  RegisterUser() {
    this.errorMessage = '';
    this.authservice.RegisterUser(this.registeredUser).subscribe({
      next: (response: AuthResponse) => {
        if (response.isAuthenticated) {
          this.authservice.setSession(response);
          this.router.navigateByUrl('/Courses');
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
