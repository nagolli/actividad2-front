import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product';
import { LoginComponent } from './components/usersManagement/login/login';
import { RoleListComponent } from './components/usersManagement/roles/list/roleList';
import { PermissionGuard, UnloggedGuard } from './guards';
import { Permission, PermissionLevel } from './signals/loginData';
import { SupplierComponent } from './components/supplier/supplier';

export const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'supplier',
    component: SupplierComponent,
    canActivate: [PermissionGuard],
    data: { permission: Permission.productos, level: PermissionLevel.read }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnloggedGuard]
  },
  {
    path: 'roles',
    component: RoleListComponent,
    canActivate: [PermissionGuard],
    data: { permission: Permission.roles, level: PermissionLevel.read }
  }
];
