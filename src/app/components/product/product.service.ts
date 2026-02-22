  
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PriceRange, Product, ProductFilters, SearchFilter } from './product.models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly http = inject(HttpClient);
  private readonly lastSearchResults = signal<Product[] | null>(null);
  private readonly reloadAllCounter = signal(0);
  readonly searchResults = this.lastSearchResults.asReadonly();
  readonly reloadAll = this.reloadAllCounter.asReadonly();

  setSearchResults(results: Product[]): void {
    this.lastSearchResults.set(results);
  }

  consumeSearchResults(): Product[] | null {
    const results = this.lastSearchResults();
    this.lastSearchResults.set(null);
    return results;
  }

  clearSearchResults(): void {
    this.lastSearchResults.set(null);
  }

  requestReloadAll(): void {
    this.lastSearchResults.set(null);
    this.reloadAllCounter.update(value => value + 1);
  }

  filter(filters: ProductFilters): Observable<Product[]> {
    return this.http.post<Product[]>(`${environment.apiUrl}/product/filter`, filters);
  }

  search(search: SearchFilter): Observable<Product[]> {
    return this.http.post<Product[]>(`${environment.apiUrl}/product/search`, search);
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