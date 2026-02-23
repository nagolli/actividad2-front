import { Component, effect, inject, ViewChild } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { hasEmployeePermission, isClient, loggedIn, loginDataSignal, notLoggedIn, Permission, PermissionLevel } from '../../signals/loginData';
import { LoginService } from '../../components/usersManagement/login/login.service';
import { Router } from '@angular/router';
import { UserComponentMode } from '../../components/usersManagement/register/userForm';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  styleUrls: ['./menu.css'],
  imports: [MenuModule],
  templateUrl: './menu.html'
})
export class MenuComponent {
  @ViewChild('menu') menu!: Menu;
  items: MenuItem[] = [];

  constructor(private router: Router) {
    effect(() => {
      loginDataSignal(); // Suscribirse a cambios en loginDataSignal
      this.items = [
        notLoggedIn() && { label: 'Iniciar sesión', icon: 'fa-solid fa-right-to-bracket', command: () => this.login() },
        notLoggedIn() && { label: 'Registrarse', icon: 'fa-solid fa-address-book', command: () => this.register() },
        loggedIn() && { label: 'Editar perfil', icon: 'fa-solid fa-pencil', command: () => this.editProfile() },
        isClient() && { label: 'Mis pedidos', icon: 'fa-solid fa-box-open', command: () => this.myOrders() },
        isClient() && { label: 'Mis reservas', icon: 'fa-solid fa-book', command: () => this.myReservations() },
        hasEmployeePermission(Permission.roles, PermissionLevel.read) && { label: 'Roles', icon: 'fa-solid fa-user-shield', command: () => this.manageRoles() },
        hasEmployeePermission(Permission.empleados, PermissionLevel.read) && { label: 'Empleados', icon: 'fa-solid fa-users', command: () => this.manageEmployees() },
        hasEmployeePermission(Permission.productos, PermissionLevel.read) && { label: 'Proveedores', icon: 'fa-solid fa-user-tie', command: () => this.manageProviders() },
        hasEmployeePermission(Permission.productos, PermissionLevel.read) && { label: 'Categorias', icon: 'fa-solid fa-tags', command: () => this.manageCategories() },
        hasEmployeePermission(Permission.promociones, PermissionLevel.read) && { label: 'Promociones', icon: 'fa-solid fa-percent', command: () => this.managePromotions() },
        loggedIn() && { label: 'Cerrar sesión', icon: 'fa-solid fa-right-from-bracket', command: () => this.logout() }
      ].filter(Boolean) as MenuItem[];
    });
  }

  private readonly loginService = inject(LoginService);

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    setTimeout(() => {
      loginDataSignal.set(null);
      this.router.navigate(['/']);
    }, 100);
  }

  register() {
    this.router.navigate(['/user', UserComponentMode.registerClient]);
  }

  editProfile() {
    if (isClient())
      this.router.navigate(['/user', UserComponentMode.editClient]);
    else
      this.router.navigate(['/user', UserComponentMode.editEmployee]);
  }

  manageRoles() {
    this.router.navigate(['/roles']);
  }

  manageEmployees() {
    this.router.navigate(['/employees']);
  }

  manageCategories() {
    this.router.navigate(['/category']);
  }

  manageProviders() {
    this.router.navigate(['/supplier']);
  }

  myOrders() {
    console.log('Ir a mis pedidos, Bloque 3');
    this.router.navigate(['/myorders']);
  }

  myReservations() {
    this.router.navigate(['/book']);
  }

  managePromotions() {
    this.router.navigate(['/promotion']);
  }
}
