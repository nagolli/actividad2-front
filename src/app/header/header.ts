import { Component } from '@angular/core';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
  imports: [InputText]
})
export class HeaderComponent {
  onSearch() {
    console.log('Buscando..');
    // TODO: implementar lógica búsqueda
  }

}


