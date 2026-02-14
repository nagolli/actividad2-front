
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Review } from './reviews.models';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private readonly http = inject(HttpClient);

  getAverageRating(id: number): Observable<number | null> {
    return this.http.get<number | null>(`${environment.apiUrl}/review/${id}/average-rating`);
  }

    // Traer todas las reviews de un producto
  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<{data: Review[]}>(`${environment.apiUrl}/review/product/${productId}`).pipe(
      map(response => response.data)
    );
  }

}