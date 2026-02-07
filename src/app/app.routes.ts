import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product';
import { LoginComponent } from './components/usersManagement/login/login';
import { RoleListComponent } from './components/usersManagement/roles/roleList.component';
import { PermissionGuard, UnloggedGuard } from './guards';
import { Permission, PermissionLevel } from './signals/loginData';

export const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent
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
