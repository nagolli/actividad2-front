import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart-item.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8000/api/order'; // ruta al endpoint store

  constructor(private http: HttpClient) {}

  createOrder(email: string, addressId: number, items: CartItem[]): Observable<any> {
    const body = {
      email,
      addressId,
      products: items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    };
    return this.http.post(this.apiUrl, body);
  }
}
