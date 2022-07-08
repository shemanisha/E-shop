/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../modals/User.model';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private token: LocalstorageService,
    private router: Router
  ) {}

  login(
    email: string,
    password: string
  ): Observable<{ token: string; message: string; user: string }> {
    return this.httpClient.post<{
      token: string;
      message: string;
      user: string;
    }>('http://localhost:3000/user/login', {
      email: email,
      passwordHash: password,
    });
  }

  logout() {
    this.token.removeItem();
    this.router.navigate(['/login']);
  }
}
