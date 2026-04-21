import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Toast } from './components/toast/toast';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ShopZone');

  constructor(private themeService: ThemeService) {}
}
