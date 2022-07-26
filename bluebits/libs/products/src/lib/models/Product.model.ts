import { Category } from './Category.model';

export class Product {
  id!: string;
  name?: string;
  description?: string;
  richDescription?: string;
  reviews?: string;
  image!: string;
  images!: string[];
  brand?: string;
  price!: number;
  category?: Category;
  countInStock?: number;
  rating?: number;
  numReviews?: number;
  isFeatured?: boolean;
  dateCreated?: string;
}
