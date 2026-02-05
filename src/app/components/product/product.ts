import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { PriceRange, Product } from './product.models';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectOption } from '../../shared/models/select-option.model';
import { SelectOptionService } from '../../shared/services/select-option.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.html',
  styleUrl: './product.css',
  standalone: true,
  imports: [
    CardModule,
    AvatarModule,
    ButtonModule,
    CommonModule,
    ReactiveFormsModule,
    SliderModule,
    InputTextModule,
    SelectModule
  ]
})
export class ProductComponent implements OnInit {
  
  private readonly productService = inject(ProductService);
  private readonly selectOptionService = inject(SelectOptionService);
  protected readonly products = signal<Product[]>([])
  protected readonly isGridView = signal<boolean>(true);
  protected readonly minPrice = 0;
  protected readonly maxPrice = 500;
  protected readonly categoryOptions = signal<SelectOption[]>([]);
  protected readonly supplierOptions = signal<SelectOption[]>([]);
  protected readonly priceRange = signal<PriceRange>({ min: 0, max: 500 });
  protected readonly priceRangeLoaded = signal<boolean>(false);

  protected readonly filtersForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
    supplier: new FormControl('', { nonNullable: true }),
    priceRange: new FormControl<[number, number]>([this.priceRange().min, this.priceRange().max], { nonNullable: true })
  });

  ngOnInit(): void {
    this.loadOptions();
    this.loadProducts();
    this.loadPriceRange();
  }

  loadOptions() {
    this.selectOptionService.getCategoryOptions().subscribe(categories => {
      this.categoryOptions.set(categories);
    });

    this.selectOptionService.getSupplierOptions().subscribe(providers => {
      this.supplierOptions.set(providers);
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }

  loadPriceRange() {
    this.productService.getPriceRange().subscribe(priceRange => {
      this.priceRange.set(priceRange);
      this.filtersForm.controls.priceRange.setValue([priceRange.min, priceRange.max]);
      this.priceRangeLoaded.set(true);
    });
  }

  onProductClick(product: Product) {
    console.log('Producto seleccionado:', product);
  }

  toggleView() {
    this.isGridView.update(value => !value);
  }

}


