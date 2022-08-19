import { JsonPipe } from '@angular/common';
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

  emptyCart() {
    const initialCart = {
      items: [],
    };
    const initialCartJson = JSON.stringify(initialCart);
    localStorage.setItem(CARTKEY, initialCartJson);
    this.cart$.next(initialCart);
  }
  getCart(): Cart {
    const cartJsonString: string = localStorage.getItem(CARTKEY)!;
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
    const cart: Cart = this.getCart();
    const CartItemExist = cart.items?.find(
      (item) => item.productid == cartItem.productid
    );
    if (CartItemExist) {
      cart.items.map((item) => {
        if (item.productid === cartItem.productid) {
          if (updateCartItem) {
            item.quantity = cartItem.quantity;
          } else {
            item.quantity = item.quantity + cartItem.quantity;
          }
        }
      });
    } else {
      cart.items?.push(cartItem);
    }

    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CARTKEY, cartJson);
    this.cart$.next(cart);
    return cart;
  }

  deleteCartItem(productid: string) {
    const cart = this.getCart();
    const newCart = cart.items.filter((item) => item.productid !== productid);
    cart.items = newCart;
    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CARTKEY, cartJsonString);
    this.cart$.next(cart);
  }
}
