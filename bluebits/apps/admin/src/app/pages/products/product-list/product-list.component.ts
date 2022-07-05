/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService, Product } from '@bluebits/products';

@Component({
  selector: 'admin-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this._getProducts();
  }

  deleteProduct(productid: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this product?',
      accept: () => {
        this.productService.deleteProduct(productid).subscribe(
          () => {
            this._getProducts();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully',
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Product is not deleted',
            });
          }
        );
      },
      reject: () => {},
    });
  }

  updateProduct(productid: string) {
    this.router.navigateByUrl(`productForm/${productid}`);
  }

  private _getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.products;
      console.log(this.products);
    });
  }
}
