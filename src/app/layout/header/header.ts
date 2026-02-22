import { Component, inject } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { MenuComponent } from '../menu/menu';
import { Router } from '@angular/router';
import { ProductService } from '../../components/product/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css', '../../shared/styles/searchContainer.css'],
  standalone: true,
  imports: [InputText, MenuComponent]
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);


  go(route: string) {    
    if (route === '/product') {
      this.productService.requestReloadAll();
    }
    this.router.navigate([route]);
  }

  onSearch(query: string) {
    const normalizedQuery = query.trim();
    this.productService.search({ query: normalizedQuery }).subscribe(products => {
      this.productService.setSearchResults(products);
      this.router.navigate(['/product']);
    });
  }
}