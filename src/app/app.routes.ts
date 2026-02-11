import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product';
import { LoginComponent } from './components/usersManagement/login/login';
import { ForgottenComponent } from './components/usersManagement/forgotten/forgotten';
import { RoleListComponent } from './components/usersManagement/roles/list/roleList';
import { PermissionGuard, UnloggedGuard } from './guards';
import { Permission, PermissionLevel } from './signals/loginData';
import { UserComponent } from './components/usersManagement/register/userForm';

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
    path: 'forgotten',
    component: ForgottenComponent,
    canActivate: [UnloggedGuard]
  }, {
    path: 'user/:mode',
    component: UserComponent,
    canActivate: [UnloggedGuard]
  },
  {
    path: 'roles',
    component: RoleListComponent,
    canActivate: [PermissionGuard],
    data: { permission: Permission.roles, level: PermissionLevel.read }
  }
];
