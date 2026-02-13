import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { getClientId } from '../../../signals/loginData';

export interface PostUserData {
    email: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
}

export interface AddressResponse {
    data: GetAddressData;
}

export interface PostAddressData {
    street: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
    number: string;
    floor?: string;
    door?: string;
    staircase?: string;
}

export interface GetAddressData {
    id: number;
    name?: string;
    street: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
    number: string;
    floor?: string;
    door?: string;
    staircase?: string;
}

export interface GetClientResponse {
    data: {
        email: string;
        name: string;
        surname: string;
        phone: string;
        addresses: GetAddressData[],
    }
}

export interface GetEmployeeResponse {
    data: {
        email: string;
        name: string;
        surname: string;
        phone: string;
        addresses: GetAddressData[],
        roles: { name: string, id: number }[]
    }
}


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    createUserAndAddress(
        client: PostUserData,
        addressName: string,
        address: PostAddressData
    ): Observable<boolean> {
        return this.createAddress(address).pipe(
            switchMap((addressId: number) => {
                return this.createUser(client, addressId, addressName);
            }),
            catchError(error => {
                console.error('Error en createUserAndAddress:', error);
                return of(false);
            })
        );
    }

    createEmployeeAndAddress(
        client: PostUserData,
        addressName: string,
        address: PostAddressData,
        roles: number[]
    ): Observable<boolean> {
        return this.createAddress(address).pipe(
            switchMap((addressId: number) => {
                return this.createEmployee(client, addressId, addressName, roles);
            }),
            catchError(error => {
                console.error('Error en createUserAndAddress:', error);
                return of(false);
            })
        );
    }

    createUser(
        client: PostUserData,
        addressId: number,
        addressName: string
    ): Observable<boolean> {
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
                return of(false);
            })
        );
    }

    createEmployee(
        employee: PostUserData,
        addressId: number,
        addressName: string,
        roles: number[]
    ): Observable<boolean> {
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
            roles: roles.map(r => { return { id: r } })
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
    ): Observable<GetClientResponse> {
        return this.http.get<GetEmployeeResponse>(`${environment.apiUrl}/employee/${clientId}`).pipe(
            tap({
                next: data => next?.(data),
                error: err => error?.(err)
            })
        );
    }
}
