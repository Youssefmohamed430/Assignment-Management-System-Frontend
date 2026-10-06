import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth-service';
import { LoginUser } from '../../models/login-user';
import { FormsModule } from '@angular/forms';
import { AuthResponse } from '../../models/auth-response';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public User: LoginUser = new LoginUser();
  errorMessage = '';

  constructor(
    private authservice: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  public Login() {
    this.errorMessage = '';
    this.authservice.LoginUser(this.User).subscribe({
      next: (response: AuthResponse) => {
        if (response.isAuthenticated) {
          this.authservice.setSession(response);
          this.router.navigateByUrl('/Courses');
        } else {
          this.errorMessage = response.message || 'Login failed';
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || error?.error?.Message || 'Login failed';
        this.cdr.markForCheck();
      },
    });
  }
}
