/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';

const TOKEN = 'token';
@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}

  setItem(data: string) {
    localStorage.setItem(TOKEN, data);
  }
  getItem() {
    return localStorage.getItem(TOKEN);
  }
  removeItem() {
    localStorage.removeItem(TOKEN);
  }
}
