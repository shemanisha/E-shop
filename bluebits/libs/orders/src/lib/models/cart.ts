export class Cart {
  items!: CartItem[];
}

export class CartItem {
  productid!: string;
  quantity!: number;
}

export class cartItemDetailed {
  product!: any;
  quantity!: number;
}
