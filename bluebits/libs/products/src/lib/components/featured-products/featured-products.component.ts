import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'products-featured-products',
  templateUrl: './featured-products.component.html',
  styles: [],
})
export class FeaturedProductsComponent implements OnInit {
  featuredProducts: Product[] = [];
  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this._getFeaturedProducts();
  }

  private _getFeaturedProducts() {
    this.productService.getFeaturedProduct(4).subscribe((featuredProducts) => {
      this.featuredProducts = featuredProducts.products;
    });
  }
}
