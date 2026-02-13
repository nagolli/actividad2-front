import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product';
import { LoginComponent } from './components/usersManagement/login/login';
import { ForgottenComponent } from './components/usersManagement/forgotten/forgotten';
import { RoleListComponent } from './components/usersManagement/roles/list/roleList';
import { EmployeeGuard, PermissionGuard, UnloggedGuard, ClientGuard } from './guards';
import { Permission, PermissionLevel } from './signals/loginData';
import { UserComponent, UserComponentMode } from './components/usersManagement/register/userForm';
import { SupplierComponent } from './components/supplier/supplier';
import { CategoryComponent } from './components/category/category';

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
    path: 'category',
    component: CategoryComponent,
    canActivate: [PermissionGuard],
    data: { permission: Permission.productos, level: PermissionLevel.read }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnloggedGuard]
  },
  {
    path: 'forgotten',
    component: ForgottenComponent,
    canActivate: [UnloggedGuard]
  }, {
    path: 'user/registerEmployee',
    component: UserComponent,
    canActivate: [PermissionGuard],
    data: { permission: Permission.empleados, level: PermissionLevel.edit, mode: UserComponentMode.registerEmployee }
  }, {
    path: 'user/editEmployee',
    component: UserComponent,
    canActivate: [EmployeeGuard],
    data: { mode: UserComponentMode.editEmployee }
  }, {
    path: 'user/editClient',
    component: UserComponent,
    canActivate: [ClientGuard],
    data: { mode: UserComponentMode.editClient }
  }, {
    path: 'user/registerClient',
    component: UserComponent,
    canActivate: [UnloggedGuard],
    data: { mode: UserComponentMode.registerClient }
  }, {
    path: 'user/send',
    component: UserComponent,
    canActivate: [UnloggedGuard],
    data: { mode: UserComponentMode.onlyToSend }
  },
  {
    path: 'roles',
    component: RoleListComponent,
    canActivate: [PermissionGuard],
    data: { permission: Permission.roles, level: PermissionLevel.read }
  }
];
