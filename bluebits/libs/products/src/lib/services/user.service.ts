import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUsers(): Observable<{ users: User[] }> {
    return this.httpClient.get<{ users: User[] }>(
      'http://localhost:3000/user/getUsers'
    );
  }
  saveUser(User: User): Observable<{ user: User; message: string }> {
    return this.httpClient.post<{ user: User; message: string }>(
      'http://localhost:3000/user/register',
      User
    );
  }

  deleteUser(userid: string): Observable<{ user: User; message: string }> {
    return this.httpClient.delete<{ user: User; message: string }>(
      `http://localhost:3000/user/${userid}`
    );
  }

  getUser(userid: string): Observable<{ user: User; message: string }> {
    return this.httpClient.get<{ user: User; message: string }>(
      `http://localhost:3000/user/${userid}`
    );
  }
  updateUser(user: User) {
    return this.httpClient.put<{ user: User; message: string }>(
      `http://localhost:3000/user/${user.id}`,
      user
    );
  }
}
