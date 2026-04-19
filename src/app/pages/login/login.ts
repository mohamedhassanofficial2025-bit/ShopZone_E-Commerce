import { JsonPipe } from '@angular/common';
import { Component, viewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email, required } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      Email: new FormControl('',[Validators.required,Validators.email]),
      Password: new FormControl('',[Validators.required,Validators.minLength(8)])
    })
  }

  login() {
    //* get the email and password
    let email:string = this.getEmail()?.value.trim()
    let password: string = this.getPassword()?.value.trim()
    console.log(email)
    console.log(password)
    //*call login from auth Service
    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log(res)
        this.route.queryParams.subscribe({
          next: (res) => {
            console.log(res[0])
            if (res[0]) {
              this.router.navigate([`/${res[0]}`])
            } else {
              this.router.navigate([`/products`])
            }
          }
        })
      }
    })
  }

  getEmail() {
    return this.loginForm.get('Email')
  }

  getPassword() {
    return this.loginForm.get('Password')
  }
}
