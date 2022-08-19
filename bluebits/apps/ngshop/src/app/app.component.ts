/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import { UsersService } from '@bluebits/users';

@Component({
  selector: 'bluebits-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent implements OnInit {
  constructor(private userService: UsersService) {}
  ngOnInit(): void {
    this.userService.initAppSession();
  }
  title = 'ngshop';
}
