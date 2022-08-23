import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@bluebits/users';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { ORDER_STATUS } from '../../order.constant';
import { take } from 'rxjs';
import { StripeService } from 'ngx-stripe';
import { LocalstorageService } from 'libs/users/src/lib/services/localstorage.service';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
})
export class CheckoutPageComponent implements OnInit {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrdersService,
    private localStorageToken: LocalstorageService,
    private stripService: StripeService
  ) {}
  checkoutFormGroup!: FormGroup;
  isSubmitted = false;
  orderItems: any = [];
  userId!: string;
  countries: any = [];

  ngOnInit(): void {
    const token = this.localStorageToken.getItem();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      this.userId = tokenDecode.userId;
      console.log(this.userId);
    }
    this._initCheckoutForm();
    this._autoFillUserData();
    this._getCartItems();
    this._getCountries();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['Manisha shete', Validators.required],
      email: ['meow15@gmail.com', [Validators.email, Validators.required]],
      phone: ['12345678', Validators.required],
      city: ['Thane', Validators.required],
      country: ['India', Validators.required],
      zip: ['400604', Validators.required],
      apartment: ['abc', Validators.required],
      street: ['abc', Validators.required],
    });
  }
  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    console.log(cart);
    this.orderItems = cart.items.map((item) => {
      return {
        product: item.productid,
        quantity: item.quantity,
      };
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm['street'].value,
      shippingAddress2: this.checkoutForm['apartment'].value,
      city: this.checkoutForm['city'].value,
      zip: this.checkoutForm['zip'].value,
      country: this.checkoutForm['country'].value,
      phone: 12345678,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`,
    };

    this.orderService.cacheOrderData(order);
    this.orderService
      .createCheckoutSession(this.orderItems)
      .subscribe((error) => {
        if (error) {
          console.log('error in redirect to payment');
        }
      });
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }

  private _autoFillUserData() {
    this.usersService
      .observeCurrentUser()
      .pipe(take(1))
      .subscribe((user) => {
        console.log(user);
      });
  }
}
