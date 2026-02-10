
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from './supplier.models';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private readonly http = inject(HttpClient);

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/supplier/${id}`);
  }
  
  updateSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${environment.apiUrl}/supplier/${supplier.id}`, supplier);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(`${environment.apiUrl}/supplier`, supplier);
  }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${environment.apiUrl}/supplier`);
  }
}