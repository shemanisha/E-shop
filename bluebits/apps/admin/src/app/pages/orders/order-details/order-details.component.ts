/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService } from '@bluebits/products';

import { ORDER_STATUS } from '../order.constant';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-order-details',
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit {
  order: Order = {};
  orderStatuses = [];
  selectedStatus: number;
  constructor(
    private orderService: OrderService,
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
          console.log('order', this.order);
        });
      }
    });
  }

  onStatusChange(event: any) {
    this.orderService.updateOrderStatus(event.value, this.order.id).subscribe(
      (data) => {
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
