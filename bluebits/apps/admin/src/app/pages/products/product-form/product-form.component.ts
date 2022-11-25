/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CategoriesService,
  Category,
  ProductsService,
} from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'admin-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  editMode: boolean = false;
  form!: FormGroup;
  isSubmitted!: boolean;
  currentProductId!: string;
  categories!: Category[];
  imageDisplay!: string | ArrayBuffer | null | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductsService,
    private categoryservice: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._getCategories();
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, Validators.required],
      countInStock: [0, Validators.required],
      category: ['', Validators.required],
      isFeatured: [false, Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
    });
    this._checkEditMode();
  }
  Submit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const productFormData = new FormData();
    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    });
    if (this.editMode) {
      this._updateProduct(productFormData);
    } else {
      this._addProduct(productFormData);
    }
  }

  private _updateProduct(product: FormData) {
    this.productService.updateProduct(product, this.currentProductId).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product updated successfully',
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
          detail: 'Product is not updated',
        });
      }
    );
  }

  private _addProduct(product: FormData) {
    this.productService.createProduct(product).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Product created successfully',
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
          detail: 'Product is not created',
        });
      }
    );
  }
  private _checkEditMode() {
    this.route.params.subscribe((param) => {
      if (param['id']) {
        this.editMode = true;
        this.currentProductId = param['id'];
        this.productService.getProduct(param['id']).subscribe((product) => {
          this.productForm['name'].setValue(product.product.name);
          this.productForm['brand'].setValue(product.product.brand);
          this.productForm['price'].setValue(product.product.price);
          this.productForm['category'].setValue(product.product.category?.id);
          this.productForm['countInStock'].setValue(
            product.product.countInStock
          );
          this.productForm['description'].setValue(product.product.description);
          this.productForm['richDescription'].setValue(
            product.product.richDescription
          );
          this.productForm['isFeatured'].setValue(product.product.isFeatured);
          this.imageDisplay = product.product.image;
          this.productForm['image'].setValidators([]);
          this.productForm['image'].updateValueAndValidity();
        });
      }
    });
  }

  get productForm() {
    return this.form.controls;
  }

  private _getCategories() {
    this.categoryservice.getCategories().subscribe((data) => {
      this.categories = data.categories;
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
  }
  onCancel() {
    this.location.back();
  }
}
