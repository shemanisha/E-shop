import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem, CartService } from '@bluebits/orders';
import { Subject } from 'rxjs';
import { Product } from '../../models/Product.model';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'product-product-details',
  templateUrl: './product-detail.component.html',
  styles: [],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product;
  endSubs: Subject<any> = new Subject();
  quantity = 1;
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      if (param['productid']) {
        this._getProduct(param['productid']);
      }
    });
  }

  private _getProduct(productid: string) {
    this.productService.getProduct(productid).subscribe((product) => {
      this.product = product.product;
    });
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productid: this.product.id,
      quantity: this.quantity,
    };
    this.cartService.setCartItem(cartItem);
  }

  ngOnDestroy(): void {
    this.endSubs.next(0);
    this.endSubs.complete();
  }
}
