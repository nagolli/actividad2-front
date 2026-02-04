import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.html',
  styleUrl: './product.css',
  standalone: true,
  imports: [CardModule, AvatarModule, ButtonModule, CommonModule]
})
export class ProductComponent implements OnInit {
  
  private readonly productService = inject(ProductService);
  protected readonly products = signal<Product[]>([])
  protected readonly isGridView = signal<boolean>(true);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  onProductClick(product: Product) {
    console.log('Producto seleccionado:', product);
  }

  toggleView() {
    this.isGridView.update(value => !value);
  }

}


