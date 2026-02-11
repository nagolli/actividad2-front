
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PriceRange, Product, ProductFilters } from './product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);

  filter(filters: ProductFilters): Observable<Product[]> {
    return this.http.post<Product[]>(`${environment.apiUrl}/product/filter`, filters);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/product`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/product/${id}`);
  }

  getPriceRange(): Observable<PriceRange> {
    return this.http.get<PriceRange>(`${environment.apiUrl}/product/price-range`);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/product/${id}`);
  }

  updateProduct(supplier: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/product/${supplier.id}`, supplier);
  }

  createProduct(supplier: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/product`, supplier);
  }
}