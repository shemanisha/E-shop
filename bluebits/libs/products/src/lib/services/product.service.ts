import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  getProducts(): Observable<{ products: Product[] }> {
    return this.httpClient.get<{ products: Product[] }>(
      'http://localhost:3000/product/getProducts'
    );
  }
  saveProduct(
    product: FormData
  ): Observable<{ product: Product; message: string }> {
    return this.httpClient.post<{ product: Product; message: string }>(
      'http://localhost:3000/product/addProduct',
      product
    );
  }

  deleteProduct(
    productid: string
  ): Observable<{ product: Product; message: string }> {
    return this.httpClient.delete<{ product: Product; message: string }>(
      `http://localhost:3000/product/${productid}`
    );
  }

  getProduct(
    productid: string
  ): Observable<{ products: Product; message: string }> {
    return this.httpClient.get<{ products: Product; message: string }>(
      `http://localhost:3000/product/${productid}`
    );
  }
  updateProduct(product: FormData, productid: string) {
    return this.httpClient.put<{ product: Product; message: string }>(
      `http://localhost:3000/product/${productid}`,
      product
    );
  }
}
