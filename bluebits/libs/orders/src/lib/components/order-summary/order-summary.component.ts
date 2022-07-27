import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [],
})
export class OrderSummaryComponent implements OnInit {
  totalPrice!: number;
  constructor(
    private cartService: CartService,
    private orderService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._getOrderSummary();
  }

  private _getOrderSummary() {
    this.cartService.cart$.pipe().subscribe((cart) => {
      this.totalPrice = 0;

      if (cart) {
        cart.items.map((item) => {
          this.orderService
            .getProduct(item.productid)
            .pipe(take(1))
            .subscribe((product) => {
              this.totalPrice += product.product.price * item.quantity;
            });
        });
      }
    });
  }

  navigateToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
