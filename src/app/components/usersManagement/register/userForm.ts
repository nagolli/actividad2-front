import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PostAddressData, PostUserData, UserService } from './user.service'
import { getClientId, getEmployeeId } from '../../../signals/loginData';
import { forkJoin } from 'rxjs';

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
        InputTextModule,
        ButtonModule
    ]
})
export class UserComponent {

    @Input() mode: UserComponentMode = UserComponentMode.registerClient;
    @Input() employeeId: number = getEmployeeId() || 0;

    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cd = inject(ChangeDetectorRef);
    formError = false;
    currentError = "Error desconocido.";
    private addressId = 0;

    private passwordsMatch(group: AbstractControl) {
        const password = group.get('password')?.value;
        const confirm = group.get('password2')?.value;

        return password === confirm ? null : { passwordMismatch: true };
    }

    userForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', Validators.required],
        surnames: ['', Validators.required],
        phone: ['', Validators.required],
        password: ['', Validators.required, Validators.minLength(8)],
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
        password2: ['', {
            validators: [Validators.required],
            updateOn: 'blur'
        }],
    }, {
        validators: this.mode == UserComponentMode.registerClient ? this.passwordsMatch : undefined
    });

    showPassword = false;
    showPassword2 = false;

    ngOnInit() {
        this.mode = this.route.snapshot.data['mode'];
        if (this.mode === UserComponentMode.editClient || this.mode === UserComponentMode.editEmployee) {
            this.loadData();
            this.userForm.get('password')?.clearValidators();
        }

        if (this.mode === UserComponentMode.onlyToSend) {
            this.userForm.get('telefono')?.clearValidators();
            this.userForm.get('password')?.clearValidators();
            this.userForm.get('password2')?.clearValidators();
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
                    console.log("Formulario tras patch:", this.userForm.value);
                },
                error: () => console.log("Error getting user data")
            });
        } else {
            this.userService.getEmployeeData(this.employeeId).subscribe({
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
                    console.log("Formulario tras patch:", this.userForm.value);
                },
                error: () => console.log("Error getting user data")
            });
        }
    }


    get email() { return this.userForm.get('email')!; }
    get name() { return this.userForm.get('name')!; }
    get surnames() { return this.userForm.get('surnames')!; }
    get phone() { return this.userForm.get('phone')!; }
    get password() { return this.userForm.get('password')!; }
    get password2() { return this.userForm.get('password2')!; }
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

    togglePassword() {
        this.showPassword = !this.showPassword;
    } togglePassword2() {
        this.showPassword2 = !this.showPassword2;
    }

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
        } else if (this.mode == UserComponentMode.editClient || this.mode == UserComponentMode.editEmployee) {
            const updateAddress$ = this.userService.updateAddress(address, this.addressId);
            const updateUser$ = this.mode == UserComponentMode.editClient ? this.userService.updateUser(client, getClientId() || 0) : this.userService.updateEmployee(client, [], this.employeeId);
            forkJoin([updateAddress$, updateUser$]).subscribe({
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

    onCancel() {
        switch (this.mode) {
            case UserComponentMode.registerClient: this.router.navigate(['/login']); break;
            case UserComponentMode.editClient: this.router.navigate(['/product']); break;
            case UserComponentMode.editEmployee: this.router.navigate(['/product']); break;
            case UserComponentMode.registerEmployee: this.router.navigate(['/employees']); break;
            case UserComponentMode.onlyToSend: this.router.navigate(['/product']); break;
        }
    }
}
