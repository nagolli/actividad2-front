import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { hasEmployeePermission, isClient, loggedIn, notLoggedIn, Permission, PermissionLevel } from './signals/loginData';

class CommonGuard implements CanActivate {
    protected router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return true;
    }
}


@Injectable({ providedIn: 'root' })
export class UnloggedGuard extends CommonGuard {
    override canActivate(): boolean {
        if (loggedIn()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}

@Injectable({ providedIn: 'root' })
export class LoggedGuard extends CommonGuard {
    override canActivate(): boolean {
        if (notLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}

@Injectable({ providedIn: 'root' })
export class ClientGuard extends CommonGuard {
    override canActivate(): boolean {
        if (!isClient()) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}

@Injectable({ providedIn: 'root' })
export class PermissionGuard extends CommonGuard {

    override canActivate(route: ActivatedRouteSnapshot): boolean {
        const requiredPermission = route.data['permission'] as Permission;
        const requiredLevel = route.data['level'] as PermissionLevel;

        if (!hasEmployeePermission(requiredPermission, requiredLevel)) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
