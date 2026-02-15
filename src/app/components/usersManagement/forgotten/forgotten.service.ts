
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
export class ForgottenService {
    private readonly http = inject(HttpClient);

    forgotten(email: string): Observable<boolean> {
        return this.http.post(`${environment.apiUrl}/forgottenPassword`, { email }).pipe(
            map((response: any) => {
                return true;
            }),
            catchError(error => {
                console.error('Error al enviar correo:', error);
                return of(false);
            })
        );
    }

}