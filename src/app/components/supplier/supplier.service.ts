
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
  
  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${environment.apiUrl}/supplier`);
  }
}