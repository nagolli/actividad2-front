import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PostAddressData, PostRoleData, PostUserData } from './userInterfaces';
import { UserService } from './user.service';
import { getClientId, getEmployeeId, hasEmployeePermission, Permission, PermissionLevel } from '../../../signals/loginData';
import { forkJoin } from 'rxjs';
import { UserCallbackService } from './userCallback.service';
import { Role } from '../roles/roleInterfaces';
import { RoleService } from '../roles/role.service';
import { SelectModule } from 'primeng/select';

export enum UserComponentMode {
    registerClient = 'registerClient',
    editClient = 'editClient',
    registerEmployee = 'registerEmployee',
    editEmployee = 'editEmployee',
    onlyToSend = 'send'
}

@Component({
    selector: 'app-user-form',
    templateUrl: './userForm.html',
    styleUrls: ['./userForm.css', '../../../shared/styles/cardContainer.css'],
    imports: [
        CommonModule,
        FormsModule,
        SelectModule,
        InputTextModule,
        ButtonModule
    ]
})
export class UserComponent {

    @Input() mode: UserComponentMode = UserComponentMode.registerClient;
    @Input() currentEmployeeId: number = getEmployeeId() || 0;

    private callbackService = inject(UserCallbackService);
    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cd = inject(ChangeDetectorRef);
    private roleService = inject(RoleService);

    private employeeId = this.callbackService.employeeId ?? this.currentEmployeeId;
    private addressId = 0;

    formError = false;
    currentError = "Error desconocido.";

    allRoles: Role[] = [];
    selectedRoles: Role[] = [];

    showPassword = false;

    solicitud: any = {
        email: '',
        name: '',
        surnames: '',
        phone: '',
        password: '',
        nameAddress: '',
        street: '',
        number: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        floor: '',
        door: '',
        staircase: '',
        roles: [null]
    };

    ngOnInit() {
        this.mode = this.route.snapshot.data['mode'];

        if (this.mode === UserComponentMode.editClient || this.mode === UserComponentMode.editEmployee) {
            this.loadData();
        }

        if (this.rolesPermission) {
            this.roleService.getList(
                data => {
                    this.allRoles = data;
                    this.updateRoleOptions();
                },
                err => console.error('Error cargando roles', err)
            ).subscribe();
        }
    }

    loadData() {
        if (this.mode === UserComponentMode.editClient) {
            this.userService.getClientData().subscribe({
                next: (response) => {
                    const d = response.data;
                    this.addressId = d.addresses[0]?.id;

                    Object.assign(this.solicitud, {
                        email: d.email,
                        name: d.name,
                        surnames: d.surname,
                        phone: d.phone,
                        nameAddress: d.addresses[0]?.name,
                        street: d.addresses[0]?.street,
                        number: d.addresses[0]?.number,
                        city: d.addresses[0]?.city,
                        province: d.addresses[0]?.province,
                        postalCode: d.addresses[0]?.postalCode,
                        country: d.addresses[0]?.country,
                        floor: d.addresses[0]?.floor,
                        door: d.addresses[0]?.door,
                        staircase: d.addresses[0]?.staircase
                    });

                    this.cd.detectChanges();
                }
            });
        }

        if (this.mode === UserComponentMode.editEmployee) {
            this.userService.getEmployeeData(this.employeeId).subscribe({
                next: (response) => {
                    const d = response.data;
                    this.addressId = d.addresses[0]?.id;

                    this.selectedRoles = d.roles;
                    this.solicitud.roles = [...d.roles.map((r: Role) => r.id), null];

                    Object.assign(this.solicitud, {
                        email: d.email,
                        name: d.name,
                        surnames: d.surname,
                        phone: d.phone,
                        nameAddress: d.addresses[0]?.name,
                        street: d.addresses[0]?.street,
                        number: d.addresses[0]?.number,
                        city: d.addresses[0]?.city,
                        province: d.addresses[0]?.province,
                        postalCode: d.addresses[0]?.postalCode,
                        country: d.addresses[0]?.country,
                        floor: d.addresses[0]?.floor,
                        door: d.addresses[0]?.door,
                        staircase: d.addresses[0]?.staircase
                    });

                    this.cd.detectChanges();
                }
            });
        }
    }

    trackByIndex(index: number, item: any) { return index; }

    get rolesPermission() {
        return hasEmployeePermission(Permission.empleados, PermissionLevel.edit)
            && (this.mode == UserComponentMode.editEmployee ? this.currentEmployeeId != this.employeeId : true);
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    addEmptyRoleRow() {
        this.solicitud.roles.push(null);
    }

    roleOptions: Role[][] = [];

    updateRoleOptions() {
        this.roleOptions = this.solicitud.roles.map((_: any, i: number) => {
            const selectedIds = new Set(this.solicitud.roles
                .map((v: number | null, idx: number) => (idx === i ? null : v))
                .filter((v: any) => v !== null && v !== undefined));
            return [{ id: null, name: '— Ninguno —' }, ...this.allRoles.filter(r => !selectedIds.has(r.id))];
        });
    }

    onRoleChange(index: number) {
        const values = this.solicitud.roles.filter((v: any) => v !== null);
        this.selectedRoles = this.allRoles.filter(r => values.includes(r.id));

        if (index === this.solicitud.roles.length - 1 && this.solicitud.roles[index] !== null) {
            this.addEmptyRoleRow();
        }
        this.updateRoleOptions();
    }

    remainingRoles(index: number): Role[] {
        const selectedIds = new Set(
            this.solicitud.roles
                .map((v: number | null, i: number) => (i === index ? null : v))
                .filter((v: any) => v !== null)
        );

        return this.allRoles.filter(r => !selectedIds.has(r.id));
    }

    isRolesInvalid(): boolean {
        return this.solicitud.roles.filter((r: any) => r !== null).length === 0;
    }

    private logFormErrors(form: NgForm) {
        console.log("Errores del formulario");
        Object.keys(form.controls).forEach(key => {
            const control = form.controls[key];
            if (control.invalid) {
                console.warn(`Campo "${key}" inválido`, control.errors);
            }
        });
    }

    onSubmit(form: NgForm) {
        if (form.invalid) {
            this.logFormErrors(form);
            this.formError = true;
            this.currentError = "Formulario inválido.";
            return;
        }

        const address: PostAddressData = {
            street: this.solicitud.street,
            number: this.solicitud.number,
            city: this.solicitud.city,
            province: this.solicitud.province,
            postalCode: this.solicitud.postalCode,
            country: this.solicitud.country,
            floor: this.solicitud.floor || undefined,
            door: this.solicitud.door || undefined,
            staircase: this.solicitud.staircase || undefined
        };

        const client: PostUserData = {
            email: this.solicitud.email,
            name: this.solicitud.name,
            surname: this.solicitud.surnames,
            phone: this.solicitud.phone || undefined,
            password: this.solicitud.password || undefined
        };

        const roles: PostRoleData = {
            ids: this.solicitud.roles.filter((v: number | null) => v !== null)
        };

        if (this.callbackService.onSuccess) {
            return this.callbackService.onSuccess(client, this.solicitud.nameAddress, address, this.addressId, roles);
        }

        if (this.mode === UserComponentMode.registerClient) {
            this.userService.createUserAndAddress(client, this.solicitud.nameAddress, address)
                .subscribe({
                    next: (response) => {
                        if (response === true) {
                            this.router.navigate(['/login']);
                        } else {
                            this.formError = true;
                            this.currentError = response || "Error en la operación.";
                        }
                    }
                });
        }

        if (this.mode === UserComponentMode.editClient ||
            (this.mode === UserComponentMode.editEmployee && !this.rolesPermission)) {

            const updateAddress = this.userService.updateAddress(address, this.addressId);
            const updateUser = this.mode === UserComponentMode.editClient
                ? this.userService.updateUser(client, getClientId() || 0)
                : this.userService.updateEmployee(client, [], this.employeeId);

            forkJoin([updateAddress, updateUser]).subscribe({
                next: () => this.router.navigate(['/product']),
                error: () => {
                    this.formError = true;
                    this.currentError = "Error en la operación.";
                }
            });
        }
    }

    onCancel() {
        if (this.callbackService.onCancel) return this.callbackService.onCancel();

        switch (this.mode) {
            case UserComponentMode.registerClient: this.router.navigate(['/login']); break;
            case UserComponentMode.registerEmployee: this.router.navigate(['/employees']); break;
            default: this.router.navigate(['/product']); break;
        }
    }
}
