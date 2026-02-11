import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

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

    private fb = inject(FormBuilder);
    private router = inject(Router);

    userForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        nombre: ['', Validators.required],
        apellidos: ['', Validators.required],
        telefono: [''],
        password: [''],
        name: ['', [Validators.required, Validators.maxLength(64)]],
        street: ['', [Validators.required, Validators.maxLength(128)]],
        number: ['', [Validators.required, Validators.maxLength(10)]],
        city: ['', [Validators.required, Validators.maxLength(64)]],
        province: ['', [Validators.required, Validators.maxLength(64)]],
        postalCode: ['', [Validators.required, Validators.maxLength(8)]],
        country: ['', [Validators.required, Validators.maxLength(64)]],
        floor: ['', [Validators.maxLength(10)]],
        door: ['', [Validators.maxLength(10)]],
        staircase: ['', [Validators.maxLength(10)]]
    });

    showPassword = false;

    ngOnInit() {
        if (this.mode === UserComponentMode.register) {
            this.userForm.get('telefono')?.setValidators([Validators.required]);
            this.userForm.get('password')?.setValidators([Validators.required]);
        }

        if (this.mode === UserComponentMode.edit) {
            this.userForm.get('telefono')?.setValidators([Validators.required]);
            // password opcional en edición
        }

        if (this.mode === UserComponentMode.onlyToSend) {
            this.userForm.get('telefono')?.clearValidators();
            this.userForm.get('password')?.clearValidators();
        }

        this.userForm.updateValueAndValidity();
    }

    get email() { return this.userForm.get('email')!; }
    get nombre() { return this.userForm.get('nombre')!; }
    get apellidos() { return this.userForm.get('apellidos')!; }
    get telefono() { return this.userForm.get('telefono')!; }
    get password() { return this.userForm.get('password')!; }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        console.log("Datos del formulario:", this.userForm.value);
    }

    onCancel() {
        this.router.navigate(['/login']);
    }
}
