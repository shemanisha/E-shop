import { Component, OnInit } from '@angular/core';
import { CartService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'ngshop-messages',
  templateUrl: './message.component.html',
  styles: [],
})
export class MessageComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      console.log('hello');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Cart updated !',
      });
    });
  }
}
