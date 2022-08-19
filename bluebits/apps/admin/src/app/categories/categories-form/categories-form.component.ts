/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitted!: boolean;
  editMode = false;
  currentCategoryId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['', Validators.required],
    });
    this._checkEditMode();
  }

  Submit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const category: Category = {
      id: this.currentCategoryId,
      name: this.categoryForm['name'].value,
      icon: this.categoryForm['icon'].value,
      color: this.categoryForm['color'].value,
    };

    if (this.editMode) {
      this._updateCategory(category);
    } else {
      this._addCategory(category);
    }
  }

  private _updateCategory(category: Category) {
    this.categoryService.updateCategory(category).subscribe(
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
          detail: 'Category is not updated',
        });
      }
    );
  }

  private _addCategory(category: Category) {
    this.categoryService.saveCategory(category).subscribe(
      (data) => {
        console.log(data);
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
          detail: 'Category is not created',
        });
      }
    );
  }
  private _checkEditMode() {
    this.route.params.subscribe((param) => {
      if (param['id']) {
        this.editMode = true;
        this.currentCategoryId = param['id'];
        this.categoryService.getCategory(param['id']).subscribe((category) => {
          this.categoryForm['name'].setValue(category.category.name);
          this.categoryForm['icon'].setValue(category.category.icon);
          this.categoryForm['color'].setValue(category.category.color);
        });
      }
    });
  }

  get categoryForm() {
    return this.form.controls;
  }
  onCancel() {
    this.location.back();
  }
}
