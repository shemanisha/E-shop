/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/Order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  getOrders(): Observable<{ orders: Order[] }> {
    return this.httpClient.get<{ orders: Order[] }>(
      'http://localhost:3000/order/getOrders'
    );
  }
  saveUser(order: Order): Observable<{ orders: Order; message: string }> {
    return this.httpClient.post<{ orders: Order; message: string }>(
      'http://localhost:3000/order/addOrder',
      order
    );
  }

  deleteOrder(orderid: string): Observable<{ order: Order; message: string }> {
    return this.httpClient.delete<{ order: Order; message: string }>(
      `http://localhost:3000/order/${orderid}`
    );
  }

  updateOrder(order: Order) {
    return this.httpClient.put<{ order: Order; message: string }>(
      `http://localhost:3000/order/${order.id}`,
      order
    );
  }
  getOrder(orderid: Order) {
    return this.httpClient.get<{ order: Order; message: string }>(
      `http://localhost:3000/order/${orderid}`
    );
  }
  updateOrderStatus(status: string, orderid: string) {
    console.log(status);
    return this.httpClient.put<{ order: Order; message: string }>(
      `http://localhost:3000/order/${orderid}`,
      { status: status }
    );
  }
}
