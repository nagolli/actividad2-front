import { Role } from "../roles/roleInterfaces";

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

export interface PostRoleData {
    ids: number[]
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
        roles: Role[],
    }
}

