/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/Category.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private httpClient: HttpClient) {}
  apiUrl = 'http://localhost:3000/categories/';

  getCategories(): Observable<{ categories: Category[] }> {
    return this.httpClient.get<{ categories: Category[] }>(
      `${this.apiUrl}getCategories`
    );
  }
  saveCategory(
    Category: Category
  ): Observable<{ categories: Category; message: string }> {
    return this.httpClient.post<{ categories: Category; message: string }>(
      `${this.apiUrl}addCategory`,
      Category
    );
  }

  deleteCategory(
    categoryid: string
  ): Observable<{ categories: Category; message: string }> {
    return this.httpClient.delete<{ categories: Category; message: string }>(
      `${this.apiUrl}${categoryid}`
    );
  }

  getCategory(
    categoryid: string
  ): Observable<{ category: Category; message: string }> {
    return this.httpClient.get<{ category: Category; message: string }>(
      `${this.apiUrl}${categoryid}`
    );
  }
  updateCategory(category: Category) {
    console.log(category);
    return this.httpClient.put<{ category: Category; message: string }>(
      `${this.apiUrl}${category.id}`,
      category
    );
  }
}
