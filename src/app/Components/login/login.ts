import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../Services/auth-service';
import { LoginUser } from '../../models/login-user';
import { FormsModule } from '@angular/forms';
import { LoginResponse } from '../../models/login-response';

@Component({
  selector: 'app-login',
  imports: [RouterLink,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public User:LoginUser = new LoginUser();

  constructor(private  authservice:AuthService,private router: Router) {}

  public Login() {

    this.authservice.LoginUser(this.User).subscribe({

      next: (response: LoginResponse) => {

        console.log('Login Response:', response);

        if (response.isAuthenticated) {

          // Save user data
          localStorage.setItem(
            'user',
            JSON.stringify(response)
          );

          // Save token separately
          localStorage.setItem(
            'token',
            response.token
          );

          // Based on Role
          const role = response.roles[0];
          this.router.navigateByUrl('/Home');
        }
      },
      error: (error) => {
        console.error('Login Error:', error);
      }
    });
  }
}
