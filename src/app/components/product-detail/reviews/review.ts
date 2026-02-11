import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ReviewService } from './review.service';

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

  ngOnInit(): void {
    console.log("ID DEL PRODUCTO ACTUAL: ", this.idProduct())
  }
  
}
