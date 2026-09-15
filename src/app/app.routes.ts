import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';

export const routes: Routes = [
    {path: 'Home', component : Home},
    {path: 'Login', component : Login},
    {path: 'Register', component : Register},
];
