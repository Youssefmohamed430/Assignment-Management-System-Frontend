import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterUser } from '../../models/register-user';
import { AuthService } from '../../Services/auth-service';
import { AuthResponse } from '../../models/auth-response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  registeredUser:RegisterUser = new RegisterUser();

  constructor(private authservice:AuthService,private router:Router) {}

  RegisterUser()
  {
      this.authservice.RegisterUser(this.registeredUser).subscribe({

      next: (response: AuthResponse) => {

        console.log('Register Response:', response);

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
        console.error('Register Error:', error);
      }
    })
  }
}
