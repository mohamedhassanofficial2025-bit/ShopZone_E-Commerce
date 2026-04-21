import { JsonPipe } from '@angular/common';
import { Component, viewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email, required } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
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
        if (!res.length) {
          this.toastService.error('Login failed', 'Please check your email and password and try again.');
          return;
        }

        this.toastService.success('Welcome back', 'You have logged in successfully.');
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
      },
      error: () => {
        this.toastService.error('Login failed', 'Something went wrong while signing you in.');
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
