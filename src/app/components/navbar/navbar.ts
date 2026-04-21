import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  currentUser: User | null = null;
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public themeService: ThemeService,
  ) {}
  ngOnInit(): void {
    this.getUserData();
    this.cdr.detectChanges();
  }

  getUserData() {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.cdr.detectChanges();
  }
  isLoggedIn(): boolean {
    this.getUserData();
    return this.authService.isLoggedIn();
  }
}
