
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly http = inject(HttpClient);

  getAverageRating(id: number): Observable<number | null> {
    return this.http.get<number | null>(`${environment.apiUrl}/review/${id}/average-rating`);
  }
}