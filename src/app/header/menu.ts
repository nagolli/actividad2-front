import { Component, effect, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { hasEmployeePermission, isClient, loggedIn, loginDataSignal, notLoggedIn, Permission, PermissionLevel } from '../signals/loginData';

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

  constructor() {
    effect(() => {
      loginDataSignal(); // Suscribirse a cambios en loginDataSignal
      this.items = [
        notLoggedIn() && { label: 'Iniciar sesión', icon: 'fa-solid fa-right-to-bracket', command: () => this.login() },
        notLoggedIn() && { label: 'Registrarse', icon: 'fa-solid fa-address-book', command: () => this.register() },
        loggedIn() && { label: 'Editar perfil', icon: 'fa-solid fa-pencil', command: () => this.editProfile() },
        isClient() && { label: 'Mis pedidos', icon: 'fa-solid fa-box-open', command: () => this.myOrders() },
        isClient() && { label: 'Mis reservas', icon: 'fa-solid fa-book', command: () => this.myReservations() },
        hasEmployeePermission(Permission.roles, PermissionLevel.read) && { label: 'Roles', icon: 'fa-solid fa-user-shield', command: () => this.manageRoles() },
        hasEmployeePermission(Permission.roles, PermissionLevel.read) && { label: 'Empleados', icon: 'fa-solid fa-users', command: () => this.manageEmployees() },
        hasEmployeePermission(Permission.productos, PermissionLevel.read) && { label: 'Proveedores', icon: 'fa-solid fa-user-tie', command: () => this.manageProviders() },
        hasEmployeePermission(Permission.productos, PermissionLevel.read) && { label: 'Categorias', icon: 'fa-solid fa-tags', command: () => this.manageCategories() },
        hasEmployeePermission(Permission.promociones, PermissionLevel.read) && { label: 'Promociones', icon: 'fa-solid fa-percent', command: () => this.managePromotions() },
        loggedIn() && { label: 'Cerrar sesión', icon: 'fa-solid fa-right-from-bracket', command: () => this.logout() }
      ].filter(Boolean) as MenuItem[];
    });
  }


  login() {
    console.log('Ir a login, Bloque 1');
    // Navegar
  }

  logout() {
    setTimeout(() => {
      loginDataSignal.set(null);
    }, 100);
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
