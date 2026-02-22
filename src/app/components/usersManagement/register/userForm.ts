import { ChangeDetectorRef, Component, Input, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PostAddressData, PostRoleData, PostUserData } from './userInterfaces'
import { UserService } from './user.service'
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
        ReactiveFormsModule,
        SelectModule,
        InputTextModule,
        ButtonModule
    ]
})
export class UserComponent {

    @Input() mode: UserComponentMode = UserComponentMode.registerClient;
    private callbackService = inject(UserCallbackService);
    @Input() currentEmployeeId: number = getEmployeeId() || 0;
    private employeeId = this.callbackService.employeeId ?? this.currentEmployeeId;

    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cd = inject(ChangeDetectorRef);
    private roleService = inject(RoleService);
    formError = false;
    currentError = "Error desconocido.";
    private addressId = 0;

    allRoles = signal<Role[]>([]);
    selectedRoles = signal<Role[]>([]);

    //private passwordsMatch(group: AbstractControl) {
    //    if (this?.mode === UserComponentMode.registerEmployee) return true;
    //    const password = group.get('password')?.value;
    //    const confirm = group.get('password2')?.value;
    //    return password === confirm ? null : { passwordMismatch: true };
    //}

    private minOneRole(control: AbstractControl) {
        if (!this.rolesPermission) return null;
        const arr = control as FormArray;
        const selected = arr.value.filter((v: number | null) => v !== null);
        return selected.length > 0 ? null : { minOneRole: true };
    }


    userForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        surnames: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        nameAddress: ['', [Validators.required, Validators.maxLength(64)]],
        street: ['', [Validators.required, Validators.maxLength(128)]],
        number: ['', [Validators.required, Validators.maxLength(10)]],
        city: ['', [Validators.required, Validators.maxLength(64)]],
        province: ['', [Validators.required, Validators.maxLength(64)]],
        postalCode: ['', [Validators.required, Validators.maxLength(8)]],
        country: ['', [Validators.required, Validators.maxLength(64)]],
        floor: ['', [Validators.maxLength(10)]],
        door: ['', [Validators.maxLength(10)]],
        staircase: ['', [Validators.maxLength(10)]],
        roles: this.fb.array([], [this.minOneRole.bind(this)]),
        //password2: ['', {
        //    validators: [Validators.required],
        //    updateOn: 'blur'
        //}],
        //}, {
        //    validators: this.mode == UserComponentMode.registerClient ? this.passwordsMatch : undefined
    });

    showPassword = false;
    //showPassword2 = false;

    ngOnInit() {
        this.mode = this.route.snapshot.data['mode'];
        if (this.mode === UserComponentMode.editClient || this.mode === UserComponentMode.editEmployee) {
            this.loadData();
            this.userForm.get('password')?.clearValidators();
        }
        if (this.mode === UserComponentMode.registerEmployee) {
            //this.userForm.get('password2')?.clearValidators();
        }
        if (this.mode === UserComponentMode.onlyToSend) {
            this.userForm.get('telefono')?.clearValidators();
            this.userForm.get('password')?.clearValidators();
            //this.userForm.get('password2')?.clearValidators();
        }

        this.userForm.updateValueAndValidity();
    }

    loadData() {
        if (this.mode === UserComponentMode.editClient) {
            this.userService.getClientData().subscribe({
                next: (response) => {
                    const data = response.data;
                    this.addressId = data.addresses[0]?.id;
                    this.userForm.patchValue({
                        email: data.email,
                        name: data.name,
                        surnames: data.surname,
                        phone: data.phone,
                        nameAddress: data.addresses[0]?.name,
                        street: data.addresses[0]?.street,
                        number: data.addresses[0]?.number,
                        city: data.addresses[0]?.city,
                        province: data.addresses[0]?.province,
                        postalCode: data.addresses[0]?.postalCode,
                        country: data.addresses[0]?.country,
                        floor: data.addresses[0]?.floor,
                        door: data.addresses[0]?.door,
                        staircase: data.addresses[0]?.staircase
                    });
                    this.cd.detectChanges();
                },
                error: () => console.log("Error getting user data")
            });
        } else if (this.mode === UserComponentMode.editEmployee) {
            this.userService.getEmployeeData(this.employeeId).subscribe({
                next: (response) => {
                    const data = response.data;
                    this.addressId = data.addresses[0]?.id;
                    this.selectedRoles.set(data.roles);
                    if (data.roles.length) {
                        this.roles.clear();
                        data.roles.forEach((role: Role) => {
                            this.roles.push(new FormControl(role.id));
                        });
                        this.addEmptyRoleRow();
                    }
                    this.userForm.patchValue({
                        email: data.email,
                        name: data.name,
                        surnames: data.surname,
                        phone: data.phone,
                        nameAddress: data.addresses[0]?.name,
                        street: data.addresses[0]?.street,
                        number: data.addresses[0]?.number,
                        city: data.addresses[0]?.city,
                        province: data.addresses[0]?.province,
                        postalCode: data.addresses[0]?.postalCode,
                        country: data.addresses[0]?.country,
                        floor: data.addresses[0]?.floor,
                        door: data.addresses[0]?.door,
                        staircase: data.addresses[0]?.staircase
                    });
                    this.cd.detectChanges();
                },
                error: () => console.log("Error getting user data")
            });
            if (this.rolesPermission) {
                this.roleService.getList(
                    data => {
                        this.allRoles.set(data);
                    },
                    err => {
                        console.error('Error cargando roles', err)
                    }
                ).subscribe();
                this.addEmptyRoleRow();
            }
        }
    }


    get email() { return this.userForm.get('email')!; }
    get name() { return this.userForm.get('name')!; }
    get surnames() { return this.userForm.get('surnames')!; }
    get phone() { return this.userForm.get('phone')!; }
    get password() { return this.userForm.get('password')!; }
    //get password2() { return this.userForm.get('password2')!; }
    get nameAddress() { return this.userForm.get("nameAddress")!; }
    get street() { return this.userForm.get("street")!; }
    get number() { return this.userForm.get("number")!; }
    get city() { return this.userForm.get("city")!; }
    get province() { return this.userForm.get("province")!; }
    get postalCode() { return this.userForm.get("postalCode")!; }
    get country() { return this.userForm.get("country")!; }
    get floor() { return this.userForm.get("floor")!; }
    get door() { return this.userForm.get("door")!; }
    get staircase() { return this.userForm.get("staircase")!; }

    get roles(): FormArray { return this.userForm.get('roles') as FormArray; }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }
    //togglePassword2() {
    //    this.showPassword2 = !this.showPassword2;
    //}

    onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        const address: PostAddressData = {
            street: this.userForm.value.street,
            number: this.userForm.value.number,
            city: this.userForm.value.city,
            province: this.userForm.value.province,
            postalCode: this.userForm.value.postalCode,
            country: this.userForm.value.country,
            floor: this.userForm.value.floor || undefined,
            door: this.userForm.value.door || undefined,
            staircase: this.userForm.value.staircase || undefined
        };
        const client: PostUserData = {
            email: this.userForm.value.email,
            name: this.userForm.value.name,
            surname: this.userForm.value.surnames,
            phone: this.userForm.value.phone || undefined,
            password: this.userForm.value.password || undefined
        };

        const roles: PostRoleData = {
            ids: this.roles.value.filter((v: number | null) => v !== null)
        }

        if (this.callbackService.onSuccess) {
            return this.callbackService.onSuccess(client, this.userForm.value.nameAddress, address, this.addressId, roles);
        }

        if (this.mode == UserComponentMode.registerClient) {
            this.userService.createUserAndAddress(client,
                this.userForm.value.nameAddress,
                address).subscribe({
                    next: (response: boolean | string) => {
                        if (response === true) {
                            this.router.navigate(['/login']);
                        } else {
                            this.formError = true;
                            if (response) {
                                this.currentError = response;
                            } else {
                                this.currentError = "Error en la operación."
                            }
                            this.userForm.reset();
                        }
                    },
                    error: (err: any) => {
                        this.formError = true;
                        this.currentError = "Error en la operación."
                        this.userForm.reset();
                    }
                });
        } else if (this.mode == UserComponentMode.editClient || (this.mode == UserComponentMode.editEmployee && !this.rolesPermission)) {
            const updateAddress = this.userService.updateAddress(address, this.addressId);
            const updateUser = this.mode == UserComponentMode.editClient ? this.userService.updateUser(client, getClientId() || 0) : this.userService.updateEmployee(client, [], this.employeeId);
            forkJoin([updateAddress, updateUser]).subscribe({
                next: ([addressResponse, userResponse]) => {
                    this.router.navigate(['/product']);
                },
                error: (err) => {
                    this.formError = true;
                    this.currentError = "Error en la operación."
                    this.userForm.reset();
                }
            });
        }

    }

    get rolesPermission() {
        return hasEmployeePermission(Permission.empleados, PermissionLevel.edit) && this.currentEmployeeId != this.employeeId
    }

    onCancel() {
        if (this.callbackService.onCancel) {
            return this.callbackService.onCancel();
        }
        switch (this.mode) {
            case UserComponentMode.registerClient: this.router.navigate(['/login']); break;
            case UserComponentMode.registerEmployee: this.router.navigate(['/employees']); break;
            default:
                this.router.navigate(['/product']); break;
        }
    }

    addEmptyRoleRow() {
        this.roles.push(new FormControl(null));
    }

    onRoleChange(index: number) {
        const values = this.roles.value.filter((v: any) => v !== null);

        // Actualizamos selectedRoles
        const selected = this.allRoles().filter(r => values.includes(r.id));
        this.selectedRoles.set(selected);

        // Si el usuario acaba de rellenar la última fila → añadimos otra vacía
        if (index === this.roles.length - 1 && this.roles.at(index).value !== null) {
            this.addEmptyRoleRow();
        }
    }

    remainingRoles(index: number): Role[] {
        const selectedIds = new Set(
            this.roles.value
                .map((v: number | null, i: number) => (i === index ? null : v))
                .filter((v: any) => v !== null)
        );

        return this.allRoles().filter(r => !selectedIds.has(r.id));
    }

}
