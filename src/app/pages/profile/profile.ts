import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit{
  currentUser: User = {} as User;
  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.currentUser=this.getUser();
  }
  
  getUser():User{
    return this.authService.getCurrentUser() as User;
  }

  logout() {
    this.authService.logout();
  }

}
