/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { UsersService } from '@bluebits/users';
import { LocalstorageService } from 'libs/users/src/lib/services/localstorage.service';

@Component({
  selector: 'ngshop-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  userName?: string;
  constructor(
    private userService: UsersService,
    private localStorageToken: LocalstorageService
  ) {}

  ngOnInit(): void {
    const token = this.localStorageToken.getItem();
    if (token) {
      this.userIsAuthenticated = true;
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      this.userService.getUser(tokenDecode.userId).subscribe((user) => {
        this.userName = user.name;
      });
    } else {
      this.userIsAuthenticated = false;
    }
  }

  clearStorage() {
    this.localStorageToken.removeItem();
  }
}
