import { signal } from "@angular/core";

export enum Permission {
    admin = 0,
    roles = 1,
    stock = 2,
    productos = 3,
    reservas = 4,
    promociones = 5
}

export enum PermissionLevel {
    none = 0,
    read = 1,
    edit = 2,
    advanced = 3
}

export interface LoginData {
    userId: number;
    isClient: boolean;
    isEmployee: boolean;
    permissions: { permissionId: Permission, level: PermissionLevel }[];
}

export const loginDataSignal = signal<LoginData | null>(null);

export function hasEmployeePermission(permission: Permission, requiredLevel: PermissionLevel): boolean {
    const loginData = loginDataSignal();
    // Si no hay datos de login, no tiene permisos
    if (loginData === null) {
        return false;
    }
    // Si no es empleado, no tiene permisos
    if (!loginData.isEmployee) {
        return false;
    }
    // Buscar el permiso solicitado
    const perm = loginData.permissions.find(p => p.permissionId === permission);
    const adminPerm = loginData.permissions.find(p => p.permissionId === Permission.admin);
    // Comprobar si tiene el nivel requerido
    return perm !== undefined && perm.level >= requiredLevel ||
        //Alternativamente, si es admin del nivel requerido, también tiene permiso
        (adminPerm !== undefined && adminPerm.level >= requiredLevel);
}

export function isClient(): boolean {
    const loginData = loginDataSignal();
    return loginData?.isClient ?? false;
}

export function getClientId(): number | null {
    const loginData = loginDataSignal();
    return loginData?.isClient ? loginData.userId : null;
}

export function notLoggedIn(): boolean {
    const loginData = loginDataSignal();
    return loginData === null || (!loginData.isClient && !loginData.isEmployee);
}

export function loggedIn(): boolean {
    return !notLoggedIn();
}