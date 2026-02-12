import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export interface PostAddressData {
    street: string;
    number: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    floor?: string;
    door?: string;
    staircase?: string;
}

export interface PostClientData {
    email: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
}

export interface AddressResponse {
    data: {
        id: number;
        street: string;
        city: string;
        postalCode: string;
        province: string;
        country: string;
        phone: string | null;
        number: string;
        floor?: string;
        door?: string;
        staircase?: string;
    };
}


@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    private readonly http = inject(HttpClient);
    createUserAndAddress(
        client: PostClientData,
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

    createUser(
        client: PostClientData,
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

    createAddress(address: PostAddressData): Observable<number> {
        return this.http.post<AddressResponse>(`${environment.apiUrl}/address`, address).pipe(
            map(response => response.data.id),
            catchError(error => {
                console.error('Error al crear dirección:', error);
                throw error;
            })
        );
    }
}
