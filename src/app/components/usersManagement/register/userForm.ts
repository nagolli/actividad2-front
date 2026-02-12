import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { PostAddressData, PostClientData, RegisterService } from './user.service'

export enum UserComponentMode {
    register = 'register',
    edit = 'edit',
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

    @Input() mode: UserComponentMode = UserComponentMode.register;

    private registerService = inject(RegisterService);
    private fb = inject(FormBuilder);
    private router = inject(Router);
    formError = false;

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
        validators: this.passwordsMatch
    });

    showPassword = false;
    showPassword2 = false;

    ngOnInit() {
        if (this.mode === UserComponentMode.edit) {
            this.userForm.get('password')?.clearValidators();
            this.userForm.get('password2')?.clearValidators();
        }

        if (this.mode === UserComponentMode.onlyToSend) {
            this.userForm.get('telefono')?.clearValidators();
            this.userForm.get('password')?.clearValidators();
            this.userForm.get('password2')?.clearValidators();
        }

        this.userForm.updateValueAndValidity();
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
        debugger;
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        console.log("Datos del formulario:", this.userForm.value);
        const address: PostAddressData = {
            street: this.userForm.value.street,
            number: this.userForm.value.number,
            city: this.userForm.value.city,
            province: this.userForm.value.province,
            postalCode: this.userForm.value.postalCode,
            country: this.userForm.value.country,
            floor: this.userForm.value.floor,
            door: this.userForm.value.door,
            staircase: this.userForm.value.staircase
        };
        const client: PostClientData = {
            email: this.userForm.value.email,
            name: this.userForm.value.name,
            surname: this.userForm.value.surnames,
            phone: this.userForm.value.phone,
            password: this.userForm.value.password
        };

        //TODO, POR LO MENOS EL ERROR DE CORREO DUPLICADO DEBERIA MOSTRARLO
        this.registerService.createUserAndAddress(client,
            this.userForm.value.nameAddress,
            address).subscribe({
                next: (response: any) => {
                    if (response) {
                        this.router.navigate(['/login']);
                    } else {
                        this.formError = true;
                        this.userForm.reset();
                    }
                },
                error: (err: any) => {
                    this.formError = true;
                    this.userForm.reset();
                }
            });
    }

    onCancel() {
        this.router.navigate(['/login']);
    }
}
