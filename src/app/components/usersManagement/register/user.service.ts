import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { getClientId } from '../../../signals/loginData';
import { AddressResponse, GetClientResponse, GetEmployeeResponse, PostAddressData, PostUserData } from './userInterfaces'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    createUserAndAddress(
        client: PostUserData,
        addressName: string,
        address: PostAddressData
    ): Observable<boolean | string> {
        return this.createAddress(address).pipe(
            switchMap((addressId: number) => {
                return this.createUser(client, addressId, addressName);
            }),
            catchError(error => {
                console.error('Error en createUserAndAddress:', error);
                if (error.status === 422 && error.error?.errors) {
                    const errores = Object.values(error.error.errors)
                        .map((e: any) => e.join(', ')).join(' | ');
                    return of(errores)
                }
                return of(false);
            })
        );
    }

    createEmployeeAndAddress(
        client: PostUserData,
        addressName: string,
        address: PostAddressData,
        roles: number[]
    ): Observable<boolean | string> {
        return this.createAddress(address).pipe(
            switchMap((addressId: number) => {
                return this.createEmployee(client, addressId, addressName, roles);
            }),
            catchError(error => {
                console.error('Error en createUserAndAddress:', error);
                if (error.status === 422 && error.error?.errors) {
                    const errores = Object.values(error.error.errors)
                        .map((e: any) => e.join(', ')).join(' | ');
                    return of(errores)
                }
                return of(false);
            })
        );
    }

    createUser(
        client: PostUserData,
        addressId: number,
        addressName: string
    ): Observable<boolean | string> {
        const body = {
            ...client,
            addresses: [
                {
                    name: addressName,
                    addressId: addressId
                }
            ]
        };
        return this.http.post(`${environment.apiUrl}/client`, body).pipe(
            map(() => true),
            catchError(error => {
                console.error('Error al crear usuario:', error);
                if (error.status === 422 && error.error?.errors) {
                    const errores = Object.values(error.error.errors)
                        .map((e: any) => e.join(', ')).join(' ');
                    return of(errores)
                }
                return of(false);
            })
        );
    }

    createEmployee(
        employee: PostUserData,
        addressId: number,
        addressName: string,
        roles: number[]
    ): Observable<boolean | string> {
        const body = {
            ...employee,
            addresses: [
                {
                    name: addressName,
                    addressId: addressId
                }
            ],
            roles: roles.map(r => { return { id: r } })
        };
        return this.http.post(`${environment.apiUrl}/employee`, body).pipe(
            map(() => true),
            catchError(error => {
                console.error('Error al crear empleado:', error);
                if (error.status === 422 && error.error?.errors) {
                    const errores = Object.values(error.error.errors)
                        .map((e: any) => e.join(', ')).join(' | ');
                    return of(errores)
                }
                return of(false);
            })
        );
    }

    createAddress(address: PostAddressData): Observable<number> {
        return this.http.post<AddressResponse>(`${environment.apiUrl}/address`, address).pipe(
            map(response => response.data.id),
            catchError(error => {
                console.error('Error al crear dirección:', error);
                throw error;
            })
        );
    }

    updateUser(
        client: PostUserData,
        id: number
    ): Observable<boolean> {
        const body = {
            ...client
        };
        return this.http.patch(`${environment.apiUrl}/client/${id}`, body).pipe(
            map(() => true),
            catchError(error => {
                console.error('Error al actualizar usuario:', error);
                return of(false);
            })
        );
    }

    updateEmployee(
        employee: PostUserData,
        roles: number[],
        id: number
    ): Observable<boolean> {
        const body = {
            ...employee,
            roles: roles.length > 0 ? roles.map(r => { return { roleId: r } }) : undefined
        };
        return this.http.patch(`${environment.apiUrl}/employee/${id}`, body).pipe(
            map(() => true),
            catchError(error => {
                console.error('Error al actualizar empleado:', error);
                return of(false);
            })
        );
    }

    updateAddress(address: PostAddressData, id: number): Observable<number> {
        return this.http.patch<AddressResponse>(`${environment.apiUrl}/address/${id}`, address).pipe(
            map(response => response.data.id),
            catchError(error => {
                console.error('Error al actualizar dirección:', error);
                throw error;
            })
        );
    }

    getClientData(
        next?: (data: GetClientResponse) => void,
        error?: (err: any) => void
    ): Observable<GetClientResponse> {
        const clientId = getClientId();
        return this.http.get<GetClientResponse>(`${environment.apiUrl}/client/${clientId}`).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }

    getEmployeeData(
        clientId: number,
        next?: (data: GetEmployeeResponse) => void,
        error?: (err: any) => void
    ): Observable<GetEmployeeResponse> {
        return this.http.get<GetEmployeeResponse>(`${environment.apiUrl}/employee/${clientId}`).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }
}
