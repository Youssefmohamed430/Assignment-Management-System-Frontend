import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { Home } from './Components/home/home';
import { Navbar } from './Components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Navbar,Home,Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Assignment-Management-System-Frontend');
}
