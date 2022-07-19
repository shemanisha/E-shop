import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../models/Product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiURLProducts = 'http://localhost:3000/product';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ product: Product[] }> {
    return this.http.get<{ product: Product[] }>(
      `${this.apiURLProducts}/getProducts`
    );
  }

  createProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiURLProducts}/addProduct`,
      productData
    );
  }

  getProduct(productId: string): Observable<{ product: Product }> {
    return this.http.get<{ product: Product }>(
      `${this.apiURLProducts}/${productId}`
    );
  }

  updateProduct(productData: FormData, productid: string): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiURLProducts}/${productid}`,
      productData
    );
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
  }

  getProductsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }
}
