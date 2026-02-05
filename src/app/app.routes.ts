import { Routes } from '@angular/router';
import { ProductComponent } from './components/product/product';
import { LoginComponent } from './components/usersManagement/login/login';
import { UnloggedGuard } from './guards';

export const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnloggedGuard]
  }
];
