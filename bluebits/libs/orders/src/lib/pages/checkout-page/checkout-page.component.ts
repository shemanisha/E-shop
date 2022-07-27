import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html',
  styles: [],
})
export class CheckoutPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  backToCart() {
    this.router.navigate(['/cart']);
  }
}
