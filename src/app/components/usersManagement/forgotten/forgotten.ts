import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { ForgottenService } from './forgotten.service';

@Component({
    selector: 'app-forgotten',
    templateUrl: './forgotten.html',
    styleUrls: ['./forgotten.css', '../../../shared/styles/cardContainer.css'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        ButtonModule
    ]
})
export class ForgottenComponent {
    private fb = inject(FormBuilder);
    private forgottenService = inject(ForgottenService);
    private router = inject(Router);
    forgottenForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });
    showPassword = false;
    forgottenError = false;
    forgottenSuccess = false;

    get email() {
        return this.forgottenForm.get('email')!;
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        if (this.forgottenForm.invalid) {
            this.forgottenForm.markAllAsTouched();
            return;
        }

        const items = this.forgottenForm.value;
        this.forgottenService.forgotten(items.email).subscribe({
            next: (response: any) => {
                if (response) {
                    this.forgottenSuccess = true;
                } else {
                    this.forgottenError = true;
                }
                this.forgottenForm.reset();
            },
            error: (err: any) => {
                this.forgottenError = true;
                this.forgottenForm.reset();
            }
        });
    }

    onLogin(): void {
        // Navegar de nuevo al login
        this.router.navigate(["/login"])
    }
}
