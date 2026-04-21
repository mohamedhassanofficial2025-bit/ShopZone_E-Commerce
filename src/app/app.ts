import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Toast } from './components/toast/toast';
import { Footer } from './components/footer/footer';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, Toast, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ShopZone');

  constructor(private themeService: ThemeService) {}
}
