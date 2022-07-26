import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../models/Category.model';
import { Product } from '../../models/Product.model';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-products-list',
  templateUrl: './products-list.component.html',
  styles: [],
})
export class ProductsListComponent implements OnInit {
  @Input() products: Product[] = [];
  @Input() categories: Category[] = [];
  isCategoryPage?: boolean;
  constructor(
    private productService: ProductsService,
    private categoryService: CategoriesService,
    private ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ActivatedRoute.params.subscribe((params) => {
      params['categoryid']
        ? this._getProducts([params['categoryid']])
        : this._getProducts();
      params['categoryid']
        ? (this.isCategoryPage = true)
        : (this.isCategoryPage = false);
    });

    this._getCategories();
    console.log(this.isCategoryPage);
  }

  private _getProducts(categoryFilter?: string[]) {
    this.productService.getProducts(categoryFilter).subscribe((products) => {
      this.products = products.product;
      console.log(this.products);
    });
  }

  private _getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories.categories;
      console.log(this.categories);
    });
  }

  categoryFilter() {
    const selectedCategories = this.categories
      .filter((category) => category?.checked)
      .map((category) => category.id);
    this._getProducts(selectedCategories);
  }
}
