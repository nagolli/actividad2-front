import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart-item.models';
import { PostAddressData, PostUserData } from '../usersManagement/register/userInterfaces'
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiFastOrderUrl = 'http://localhost:8000/api/fastorder';
  private apiOrderUrl = 'http://localhost:8000/api/order';

  constructor(private http: HttpClient) {}

  createFastOrder(user: PostUserData, address: PostAddressData, items: CartItem[]): Observable<any> {
    const body = {
      email: user.email,
      name: user.name,
      surname: user.surname,
      phone: user.phone,

      street: address.street,
      number: address.number,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
      floor: address.floor,

      products: items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    };
    return this.http.post(this.apiFastOrderUrl, body);
  }

  createOrder(userId: number, items: CartItem[]): Observable<any> {
    const body = {      
      userId,
      products: items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))
    };
    return this.http.post(this.apiOrderUrl, body);
  }
}
