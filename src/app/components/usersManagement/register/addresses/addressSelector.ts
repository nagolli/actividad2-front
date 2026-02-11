import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserComponentMode } from '../userForm';
import { AddressItemComponent } from './addressItem';

@Component({
    selector: 'app-addresses-form',
    standalone: true,
    templateUrl: './addressSelector.html',
    imports: [CommonModule, ReactiveFormsModule, AddressItemComponent]
})
export class AddressesComponent implements OnInit {

    @Input() parentForm!: FormGroup;
    @Input() mode!: UserComponentMode;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        // Creamos el FormArray dentro del formulario padre
        this.parentForm.addControl('addresses', this.fb.array<FormGroup>([]));

        // Si es SoloDatosMinimos, añadimos 1 dirección obligatoria
        if (this.mode === UserComponentMode.onlyToSend) {
            this.addAddress();
        }
    }

    get addresses(): FormArray<FormGroup> { return this.parentForm.get('addresses') as FormArray<FormGroup>; }

    addAddress() {
        if (this.mode === UserComponentMode.onlyToSend && this.addresses.length >= 1) {
            return;
        }

        const group = this.fb.group({
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

        this.addresses.push(group);
    }

    removeAddress(index: number) {
        if (this.mode === UserComponentMode.onlyToSend) return;
        this.addresses.removeAt(index);
    }
}
