/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'users-user-login',
  templateUrl: './user-login.component.html',
})
export class UserLoginComponent implements OnInit {
  form: FormGroup | any;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email or password is incorrect';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private localStorage: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._initLoginForm();
  }

  private _initLoginForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    this.authService
      .login(
        this.loginFormControl['email'].value,
        this.loginFormControl['password'].value
      )
      .subscribe(
        (user) => {
          this.authError = false;
          this.localStorage.setItem(user.token);
          this.router.navigate(['/']);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.authMessage = error.error.message;
          this.authError = true;
        }
      );
  }

  get loginFormControl() {
    return this.form.controls;
  }
}
