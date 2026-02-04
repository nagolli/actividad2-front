import { Component, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  styleUrls: ['./menu.css'],
  imports: [MenuModule],
  template: ` 
  <p-menu #menu [model]="items" popup></p-menu>
   `
})
export class MenuComponent {
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      { label: 'Iniciar sesión', icon: 'fa-solid fa-right-to-bracket', command: () => this.login() },
      { label: 'Registrarse', icon: 'fa-solid fa-address-book', command: () => this.register() },
      { label: 'Editar perfil', icon: 'fa-solid fa-pencil', command: () => this.editProfile() },
      { label: 'Mis pedidos', icon: 'fa-solid fa-box-open', command: () => this.myOrders() },
      { label: 'Mis reservas', icon: 'fa-solid fa-book', command: () => this.myReservations() },
      { label: 'Roles', icon: 'fa-solid fa-user-shield', command: () => this.manageRoles() },
      { label: 'Empleados', icon: 'fa-solid fa-users', command: () => this.manageEmployees() },
      { label: 'Proveedores', icon: 'fa-solid fa-user-tie', command: () => this.manageProviders() },
      { label: 'Categorias', icon: 'fa-solid fa-tags', command: () => this.manageCategories() },
      { label: 'Promociones', icon: 'fa-solid fa-percent', command: () => this.managePromotions() },
      { label: 'Cerrar sesión', icon: 'fa-solid fa-right-from-bracket', command: () => this.logout() }
    ];
  }

  login() {
    console.log('Ir a login, Bloque 1');
    // Navegar
  }

  register() {
    console.log('Ir a registro, Bloque 1');
    // Navegar
  }

  editProfile() {
    console.log('Ir a editar perfil, Bloque 1');
    // Navegar
  }

  manageRoles() {
    console.log('Ir a gestionar roles, Bloque 1');
    // Navegar
  }

  manageEmployees() {
    console.log('Ir a gestionar empleados, Bloque 1');
    // Navegar
  }

  logout() {
    console.log('Cerrar sesión, Bloque 1');
    // Cerrar sesión
  }

  manageCategories() {
    console.log('Ir a gestionar categorias, Bloque 2');
    // Navegar
  }

  manageProviders() {
    console.log('Ir a gestionar proveedores, Bloque 2');
    // Navegar
  }

  myOrders() {
    console.log('Ir a mis pedidos, Bloque 3');
    // Navegar
  }

  myReservations() {
    console.log('Ir a mis reservas, Bloque 4');
    // Navegar
  }

  managePromotions() {
    console.log('Ir a gestionar promociones, Bloque 5');
    // Navegar
  }
}
