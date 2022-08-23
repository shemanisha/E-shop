import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';
import { StripeService } from 'ngx-stripe';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiURLOrders = 'http://localhost:3000/order';
  apiURLProducts = 'http://localhost:3000/product';

  constructor(private http: HttpClient, private stripeService: StripeService) {}

  getOrders(): Observable<{ orders: Order[] }> {
    return this.http.get<{ orders: Order[] }>(this.apiURLOrders + '/getOrders');
  }

  getOrder(orderId: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.apiURLOrders}/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    console.log('order', order);
    return this.http.post<Order>(this.apiURLOrders + '/addOrder', order);
  }

  updateOrder(status: string, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, {
      status: status,
    });
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
  }

  getOrdersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  getTotalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/TotalSales`)
      .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  getProduct(productId: string): Observable<{ product: any }> {
    return this.http.get<{ product: any }>(
      `${this.apiURLProducts}/${productId}`
    );
  }

  createCheckoutSession(orderItems: OrderItem[]) {
    return this.http
      .post(`${this.apiURLOrders}/create-checkout-session`, orderItems)
      .pipe(
        switchMap((session: any) => {
          return this.stripeService.redirectToCheckout({
            sessionId: session.id,
          });
        })
      );
  }

  cacheOrderData(order: Order) {
    localStorage.setItem('orderdata', JSON.stringify(order));
  }

  getCacheOrderData(): Order {
    return JSON.parse(localStorage.getItem('orderdata') || '{}');
  }

  removeCacheOrderData() {
    localStorage.removeItem('orderdata');
  }
}
