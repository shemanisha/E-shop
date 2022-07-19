/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@bluebits/orders';

import { ORDER_STATUS } from '../order.constant';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-order-details',
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit {
  order: Order;
  orderStatuses = [];
  selectedStatus: number;
  constructor(
    private orderService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this._getOrder();
    this._mapOrderStatus();
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label,
      };
    });
  }
  private _getOrder() {
    this.route.params.subscribe((param) => {
      if (param['id']) {
        this.orderService.getOrder(param['id']).subscribe((data) => {
          this.order = data.order;
          this.selectedStatus = data.order.status;
          console.log(this.selectedStatus);
        });
      }
    });
  }

  onStatusChange(event: any) {
    this.orderService.updateOrder(event.value, this.order.id).subscribe(
      (data) => {
        console.log(data);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Status updated successfully',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Status is not updated',
        });
      }
    );
  }
}
