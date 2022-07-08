import { OrderItem } from './OrderItem.model';
import { User } from '../../../../users/src/lib/modals/User.model';

export class Order {
  id?: string;
  orderItems?: OrderItem[];
  shippingAddress1?: string;
  shippingAddress2?: boolean;
  city?: string;
  phone?: number;
  zip?: string;
  country?: string;
  status?: number;
  totalPrice?: string;
  user?: User;
  dateOrdered?: string;
}
