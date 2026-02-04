
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { loginDataSignal } from '../../../signals/loginData';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private readonly http = inject(HttpClient);

    login(email: string, password: string) {
        this.http.post(`${environment.apiUrl}/login`, { email, password }).subscribe({
            next: (response) => {
                const data = response as any;
                loginDataSignal.set({
                    userId: data?.appClientId,
                    isClient: data?.is_client,
                    isEmployee: data?.is_employee,
                    permissions: data?.employee_permissions.map((p: any) => {
                        return {
                            permissionId: p.id,
                            level: p.lvl
                        };
                    }) || []
                });
            },
            error: (error) => {
                console.error('Error al iniciar sesión:', error);
            }
        });
    }
}