/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UserService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'admin-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitted!: boolean;
  editMode = false;
  currentCategoryId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: [false, Validators.required],
      phone: [0, Validators.required],
      street: ['', Validators.required],
      apartment: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
    this._checkEditMode();
  }

  Submit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const user: User = {
      id: this.currentCategoryId,
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      isAdmin: this.userForm['isAdmin'].value,
      country: this.userForm['country'].value,
    };

    if (this.editMode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  }

  private _updateUser(user: User) {
    this.userService.updateUser(user).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: data.message,
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not updated',
        });
      }
    );
  }

  private _addUser(user: User) {
    this.userService.saveUser(user).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: data.message,
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User is not created',
        });
      }
    );
  }
  private _checkEditMode() {
    this.route.params.subscribe((param) => {
      if (param['id']) {
        this.editMode = true;
        this.currentCategoryId = param['id'];
        this.userService.getUser(param['id']).subscribe((user) => {
          this.userForm['name'].setValue(user.user.name);
          this.userForm['email'].setValue(user.user.email);
          this.userForm['isAdmin'].setValue(user.user.isAdmin);
          this.userForm['country'].setValue(user.user.country);
        });
      }
    });
  }

  get userForm() {
    return this.form.controls;
  }
}
