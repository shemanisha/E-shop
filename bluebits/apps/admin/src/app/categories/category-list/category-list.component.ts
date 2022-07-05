/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService, Category } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'admin-category-list',
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [{}];
  constructor(
    private categoryservice: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._getCategories();
  }

  deleteCategory(categoryid: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this category?',
      accept: () => {
        this.categoryservice.deleteCategory(categoryid).subscribe(
          (data) => {
            this._getCategories();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Category deleted successfully',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Category is not deleted',
            });
          }
        );
      },
      reject: () => {},
    });
  }

  updateCategory(categoryid: string) {
    this.router.navigateByUrl(`categoryForm/${categoryid}`);
  }

  private _getCategories() {
    this.categoryservice.getCategories().subscribe((data) => {
      this.categories = data.categories;
    });
  }
}
