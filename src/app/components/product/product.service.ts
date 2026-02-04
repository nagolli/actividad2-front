
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  
  getProducts() {
    return this.http.get(`${environment.apiUrl}/product`);
  }
}