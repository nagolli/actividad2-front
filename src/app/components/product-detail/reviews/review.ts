import { Component, inject, signal, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ReviewService } from './review.service';
import { Review } from './reviews.models';

@Component({
  standalone: true,
  selector: 'app-review',
  imports: [CommonModule, ButtonModule, InputNumberModule, FormsModule],
  templateUrl: './review.html',
  styleUrl: './review.css'
})
export class ReviewComponent implements OnInit {

  private readonly reviewService = inject(ReviewService);
  readonly idProduct = input.required<number>();

  reviews = signal<Review[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  ngOnInit(): void {
    if (!this.idProduct) {
      this.error.set('ID de producto no definido');
      this.loading.set(false);
      return;
    }

    // Traer todas las reviews
    this.reviewService.getReviewsByProduct(this.idProduct())
    .subscribe({
      next: (data) => {
        console.log('Reviews recibidas:', data);
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudieron cargar las reseñas');
        this.loading.set(false); 
      }
    });

    // Traer promedio de rating
    //this.reviewService.getAverageRating(this.idProduct())
    //  .subscribe(avg => this.getAverageRating.set(avg));
  }
  
    // Función para pintar estrellas llenas, medias o vacías
  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push('pi pi-star'); // llena
      else stars.push('pi pi-star-o');           // vacía
    }
    return stars;
  }
}
