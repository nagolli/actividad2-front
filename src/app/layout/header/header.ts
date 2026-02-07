import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { MenuComponent } from '../menu/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css', '../../shared/styles/searchContainer.css'],
  standalone: true,
  imports: [InputText, MenuComponent]
})
export class HeaderComponent {
  onSearch() {
    console.log('Buscando..');
    // TODO: implementar lógica búsqueda
  }

}


