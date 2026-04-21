import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly isDarkMode = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    this.applyTheme(useDark);
  }

  toggleTheme() {
    this.applyTheme(!this.isDarkMode());
  }

  private applyTheme(isDark: boolean) {
    this.isDarkMode.set(isDark);
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}
