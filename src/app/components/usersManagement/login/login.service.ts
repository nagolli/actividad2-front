
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { loginDataSignal } from '../../../signals/loginData';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private readonly http = inject(HttpClient);

    login(email: string, password: string): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/login`, { email, password }).pipe(
            map((response: any) => {
                if (response?.appClientId) {
                    loginDataSignal.set({
                        userId: response?.appClientId,
                        isClient: response?.is_client,
                        isEmployee: response?.is_employee,
                        permissions: response?.employee_permissions?.map((p: any) => ({
                            permissionId: p.id,
                            level: p.lvl
                        })) || []
                    });
                    return true;
                } else {
                    console.log('Login incorrecto', response);
                    return false;
                }
            }),
            catchError(error => {
                console.error('Error al iniciar sesión:', error);
                return of(false);
            })
        );
    }

}