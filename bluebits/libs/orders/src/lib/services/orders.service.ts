import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiURLOrders = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<{ orders: Order[] }> {
    return this.http.get<{ orders: Order[] }>(this.apiURLOrders + '/getOrders');
  }

  getOrder(orderId: string): Observable<{ order: Order }> {
    return this.http.get<{ order: Order }>(`${this.apiURLOrders}/${orderId}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order);
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
}
