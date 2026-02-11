import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.models';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../category/category.service';
import { SupplierService } from '../supplier/supplier.service';
import { Category } from '../category/category.models';
import { Supplier } from '../supplier/supplier.models';
import { ReviewService } from './reviews/review.service';
import { ReviewComponent } from "./reviews/review";

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, ButtonModule, FormsModule, ReviewComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly reviewService = inject(ReviewService);
  category = signal<Category | null>(null)
  supplier = signal<Supplier | null>(null)
  readonly productId = signal<number>(Number(this.route.snapshot.paramMap.get('id')));
  protected readonly product = signal<Product | null>(null);
  protected readonly rating = signal<number | null>(null);
  protected readonly quantity = signal<number>(1);
  protected readonly stars = [1, 2, 3, 4, 5];

  protected getStarClass(star: number): string {
    const value = this.rating() ?? 0;
    if (value >= star) {
      return 'fas fa-star text-warning';
    }
    if (value >= star - 0.5) {
      return 'fas fa-star-half-alt text-warning';
    }
    return 'far fa-star text-muted';
  }

  ngOnInit(): void {
    this.loadData()
  }
  
  loadData() {
    this.productService.getProduct(this.productId()).subscribe(product => {
      this.product.set(product);
      const categoryId = product.categoryId;
      const supplierId = product.supplierId;
      if (categoryId) {
        this.categoryService.getCategory(categoryId).subscribe(category => {
          this.category.set(category);
        });
      }
      if (supplierId) {
        this.supplierService.getSupplier(supplierId).subscribe(supplier => {
          this.supplier.set(supplier);
        });
      }
      this.reviewService.getAverageRating(this.productId()).subscribe(rating => {
        this.rating.set(rating);
      });
    });
  }

  addToCart() {
    console.log('Agregar al carrito', this.product(), this.quantity());
  }
}
