/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  constructor(
    private confirmationService: ConfirmationService,
    private userService: UsersService,
    private messageService: MessageService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this._getUsers();
  }

  deleteUser(userid: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this product?',
      accept: () => {
        this.userService.deleteUser(userid).subscribe(
          (data) => {
            this._getUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully',
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User is not deleted',
            });
          }
        );
      },
      reject: () => {},
    });
  }

  updateUser(userid: string) {
    this.router.navigateByUrl(`userForm/${userid}`);
  }

  private _getUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data.users;
      console.log(this.users);
    });
  }
}
