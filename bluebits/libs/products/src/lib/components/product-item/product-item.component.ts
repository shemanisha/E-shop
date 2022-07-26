import { Component, Input, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '@bluebits/orders';
import { Product } from '../../models/Product.model';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [],
})
export class ProductItemComponent implements OnInit {
  @Input()
  product!: Product;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  addProductToCart() {
    const CartItem: CartItem = {
      productid: this.product.id,
      quantity: 1,
    };
    this.cartService.setCartItem(CartItem);
  }
}
