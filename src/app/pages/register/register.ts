import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { tap } from 'rxjs';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  constructor(private authService:AuthService) {
    
    this.registerForm = new FormGroup({
      FullName: new FormControl('',[Validators.required,Validators.minLength(10)]),
      Email : new FormControl('', [Validators.required, Validators.email]),
      Password : new FormControl('', [Validators.required, Validators.minLength(8)]),
      ConfirmPassword: new FormControl('', [Validators.required])
    }, {
      validators: this.passwordMatchValidator
    })
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('Password')?.value;
  const confirm = group.get('ConfirmPassword')?.value;

  if (pass === confirm) {
    return null;
  } else {
    return { notMatch: true };
  }
}

  getName(){
    return this.registerForm.get('FullName')
  }

  getEmail() {
    return this.registerForm.get('Email')
  }

  getPassword() {
    return this.registerForm.get('Password')
  }

  getConfirmPassword() {
    return this.registerForm.get('ConfirmPassword')
  }


  Register() {
    const user: User = {
      name: this.getName()?.value.trim(),
      email: this.getEmail()?.value.trim(),
      password: this.getPassword()?.value.trim(),
      role: 'user'
    }
    // console.log(user)
    this.authService.register(user).subscribe({
      next: (res) => {
        console.log(res)
      }
    })
  }
}
