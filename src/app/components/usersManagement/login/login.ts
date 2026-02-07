import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        ButtonModule
    ]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private loginService = inject(LoginService);
    private router = inject(Router);
    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });
    showPassword = false;
    loginError = false;

    get email() {
        return this.loginForm.get('email')!;
    }

    get password() {
        return this.loginForm.get('password')!;
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        const items = this.loginForm.value;
        this.loginService.login(items.email, items.password).subscribe({
            next: (response: any) => {
                if (response) {
                    this.router.navigate(['/product']);
                } else {
                    this.loginError = true;
                    this.loginForm.reset();
                }
            },
            error: (err: any) => {
                this.loginError = true;
                this.loginForm.reset();
            }
        });
    }

    onForgotPassword(): void {
        // Navegar a la pantalla de recuperación o abrir un diálogo
        console.log('Ir a recuperar contraseña');
    }

    onRegister(): void {
        // Navegar a la pantalla de registro
        console.log('Ir a registro');
    }
}
