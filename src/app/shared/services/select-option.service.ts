
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectOption } from '../models/select-option.model';

@Injectable({
  providedIn: 'root'
})
export class SelectOptionService {
  private readonly http = inject(HttpClient);

  getCategoryOptions(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(`${environment.apiUrl}/category/options`);
  }

  getSupplierOptions(): Observable<SelectOption[]> {
    return this.http.get<SelectOption[]>(`${environment.apiUrl}/supplier/options`);
  }
}