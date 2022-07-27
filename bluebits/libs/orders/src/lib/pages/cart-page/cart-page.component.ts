import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@bluebits/products';
import { Subject, takeUntil } from 'rxjs';
import { cartItemDetailed } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [],
})
export class CartPageComponent implements OnInit, OnDestroy {
  cartItemDetailed: cartItemDetailed[] = [];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();
  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    this._getCartDetails();
  }

  private _getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.cartItemDetailed = [];
      this.cartCount = cart?.items.length ?? 0;
      cart.items.forEach((cartItem) => {
        this.orderService
          .getProduct(cartItem.productid)
          .subscribe((product) => {
            this.cartItemDetailed.push({
              product: product.product,
              quantity: cartItem.quantity,
            });
          });
      });
    });
  }

  backToShop() {
    this.router.navigate(['/products']);
  }
  deleteCartItem(cartItem: cartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product.id);
  }

  ngOnDestroy(): void {
    this.endSubs$.next(0);
    this.endSubs$.complete();
  }

  updateCartItemQuantity(event: any, cartItem: cartItemDetailed) {
    this.cartService.setCartItem(
      {
        productid: cartItem.product.id,
        quantity: event.value,
      },
      true
    );
  }
}
