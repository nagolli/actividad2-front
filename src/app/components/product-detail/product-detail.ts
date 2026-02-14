import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Permission, PermissionLevel, hasEmployeePermission } from '../../signals/loginData';
import { SelectOption } from '../../shared/models/select-option.model';
import { SelectOptionService } from '../../shared/services/select-option.service';
import { CartService } from '../cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, ButtonModule, FormsModule, ReviewComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {

  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly supplierService = inject(SupplierService);
  private readonly reviewService = inject(ReviewService);
  protected readonly categoryOptions = signal<SelectOption[]>([]);
  protected readonly supplierOptions = signal<SelectOption[]>([]);
  private readonly selectOptionService = inject(SelectOptionService);
  category = signal<Category | null>(null)
  supplier = signal<Supplier | null>(null)
  readonly productId = signal<number>(Number(this.route.snapshot.paramMap.get('id')));
  protected readonly product = signal<Product | null>(null);
  protected readonly rating = signal<number | null>(null);
  protected readonly quantity = signal<number>(1);
  protected readonly isEditing = signal<boolean>(false);
  protected readonly stars = [1, 2, 3, 4, 5];
  protected message = signal<string>('');

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
    this.loadOptions();

    if (this.router.url.includes('/new')) {
      // Nuevo producto
      this.isEditing.set(true);
      this.product.set({
        id: 0,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        image: '',
        inactive: 1,
        categoryId: 1,
        supplierId: 1
      } as Product);
    } else {
      this.productId.set(Number(this.route.snapshot.paramMap.get('id')));
      this.loadData();
    }
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

  loadOptions() {
    this.selectOptionService.getCategoryOptions().subscribe(categories => {
      this.categoryOptions.set(categories);
    });

    this.selectOptionService.getSupplierOptions().subscribe(providers => {
      this.supplierOptions.set(providers);
    });
  }

  addToCart() {    
    const prod = this.product();
    const qty = this.quantity();
    if (!prod) return;
    if (!qty) return; 

    this.cartService.addProduct({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      quantity: qty
    });
    //console.log('Agregar al carrito', this.product(), this.quantity());
    //this.messageService.add({severity:'success', summary:'Éxito', detail:'Producto agregado al carrito'});
    this.message.set(`Se agrego ${qty} ${prod.name}(s)`)
    // Quitar mensaje en 3 segundos...
    setTimeout(() => this.message.set(''), 3000);
  }

  hasPermission() {
    return hasEmployeePermission(Permission.productos, PermissionLevel.edit);
  }

  onEdit() {
    this.isEditing.set(true);
  }

  onSave() {
    const p = this.product();
    if (!p) return;
    this.productService.updateProduct(p).subscribe(() => {
      this.loadData();
      this.isEditing.set(false);
    });
  }

  onCancel() {
    this.loadData();
    this.isEditing.set(false);
  }

  onDelete() {
    const p = this.product();
    if (!p || !p.id) return;
    this.productService.deleteProduct(p.id).subscribe(() => {
      this.router.navigate(['/product']);
    });
  }

  onCreate() {
    const p = this.product();
    if (!p) return;

    this.productService.createProduct(p).subscribe(() => {
      this.router.navigate(['/product']);
    });
  }


}
