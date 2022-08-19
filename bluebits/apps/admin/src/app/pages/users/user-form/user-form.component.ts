/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
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
  countries: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._initUserForm();
    this._getCountries();
    this._checkEditMode();
  }

  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isAdmin: [false, Validators.required],
      phone: [0, Validators.required],
      street: ['', Validators.required],
      apartment: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  private _getCountries() {
    this.countries = this.userService.getCountries();
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
      apartment: this.userForm['apartment'].value,
      passwordHash: this.userForm['password'].value,
      street: this.userForm['street'].value,
      zip: this.userForm['zipCode'].value,
      phone: +this.userForm['phone'].value,
      city: this.userForm['city'].value,
    };
    console.log(user);
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
          detail: 'Details updated successfully',
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
    this.userService.createUser(user).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Details added successfully',
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
          console.log(user);
          this.userForm['name'].setValue(user.name);
          this.userForm['email'].setValue(user.email);
          this.userForm['isAdmin'].setValue(user.isAdmin);
          this.userForm['country'].setValue(user.country);
          this.userForm['apartment'].setValue(user.apartment);
          this.userForm['street'].setValue(user.street);
          this.userForm['zipCode'].setValue(user.zip);
          this.userForm['phone'].setValue(user.phone);
          this.userForm['city'].setValue(user.city);
          this.userForm['password'].setValidators([]);
          this.userForm['password'].updateValueAndValidity();
        });
      }
    });
  }

  get userForm() {
    return this.form.controls;
  }

  onCancel() {
    this.location.back();
  }
}
