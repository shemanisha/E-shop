import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';
import * as countriesLib from 'i18n-iso-countries';
declare const require: any;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getUsers(): Observable<{ users: User[] }> {
    return this.httpClient.get<{ users: User[] }>(
      'http://localhost:3000/user/getUsers'
    );
  }
  saveUser(User: User): Observable<{ users: User; message: string }> {
    return this.httpClient.post<{ users: User; message: string }>(
      'http://localhost:3000/user/register',
      User
    );
  }

  deleteUser(userid: string): Observable<{ user: User; message: string }> {
    return this.httpClient.delete<{ user: User; message: string }>(
      `http://localhost:3000/user/${userid}`
    );
  }

  getUser(userid: string): Observable<{ users: User; message: string }> {
    return this.httpClient.get<{ users: User; message: string }>(
      `http://localhost:3000/user/${userid}`
    );
  }
  updateUser(user: User) {
    return this.httpClient.put<{ user: User; message: string }>(
      `http://localhost:3000/user/${user.id}`,
      user
    );
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(
      countriesLib.getNames('en', { select: 'official' })
    ).map((entry) => {
      return {
        id: entry[0],
        name: entry[1],
      };
    });
  }
}
