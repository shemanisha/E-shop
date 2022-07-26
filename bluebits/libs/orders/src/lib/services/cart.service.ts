import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';
export const CARTKEY = 'cart';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());
  constructor() {}

  initLocalStorage() {
    const cart = this.getCart();
    if (!cart) {
      const initialCart = {
        items: [],
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem(CARTKEY, initialCartJson);
    }
  }
  getCart(): Cart {
    const cartJsonString: string = localStorage.getItem(CARTKEY)!;
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  setCartItem(cartItem: CartItem): Cart {
    const cart: Cart = this.getCart();
    const CartItemExist = cart.items?.find(
      (item) => item.productid == cartItem.productid
    );
    if (CartItemExist) {
      cart.items?.map((item) => {
        if (item.productid === cartItem.productid) {
          item.quantity = item.quantity + cartItem.quantity;
        }
      });
    } else {
      cart.items?.push(cartItem);
    }
    console.log(cart);
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CARTKEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }
}
