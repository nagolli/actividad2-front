import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { UserComponentMode } from '../register/userForm';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrls: ['./login.css', '../../../shared/styles/cardContainer.css'],
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
        // Navegar a la pantalla de recuperación
        this.router.navigate(["/forgotten"])
    }

    onRegister(): void {
        //navegar a registro
        this.router.navigate(['/user', UserComponentMode.register]);
    }
}
