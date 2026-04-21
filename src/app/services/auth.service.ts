import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  
  login(email: string, password: string): Observable<User[]> {
    const params = {
      email,
      password
    };
    return this.http.get<User[]>(`${environment.apiUrl}/users`, { params });
  }

  register(user: User):Observable<User>{
    return this.http.post<User>(`${environment.apiUrl}/users`,user)
  }
  
  isLoggedIn():boolean {
    if (localStorage.getItem('userId'))
      return true;
    else
      return false;
  }

  getCurrentUser(): User | null{
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    localStorage.removeItem('currentUser')
    this.router.navigateByUrl('/login')
  }
}
