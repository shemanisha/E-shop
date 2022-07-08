/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrderService } from '@bluebits/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constant';

@Component({
  selector: 'admin-order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  orderStatus: any = ORDER_STATUS;
  orders: Order[] = [];
  constructor(
    private confirmationService: ConfirmationService,
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this._getOrders();
    console.log(this.orderStatus[0]);
  }

  deleteOrder(orderid: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this order?',
      accept: () => {
        this.orderService.deleteOrder(orderid).subscribe(
          (data) => {
            this._getOrders();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Order deleted successfully',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Order is not deleted',
            });
          }
        );
      },
      reject: () => {},
    });
  }

  updateOrder(orderid: string) {
    this.router.navigateByUrl(`orderDetails/${orderid}`);
  }

  private _getOrders() {
    this.orderService.getOrders().subscribe((data) => {
      this.orders = data.orders;
      console.log(this.orders);
    });
  }
}
