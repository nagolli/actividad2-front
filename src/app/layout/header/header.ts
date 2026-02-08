import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { MenuComponent } from '../menu/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css', '../../shared/styles/searchContainer.css'],
  standalone: true,
  imports: [InputText, MenuComponent]
})
export class HeaderComponent {

  constructor(private router: Router) { }

  go(route: string) {
    this.router.navigate([route]);
  }

  onSearch() {
    console.log('Buscando..');
    // TODO: implementar lógica búsqueda
  }

}


