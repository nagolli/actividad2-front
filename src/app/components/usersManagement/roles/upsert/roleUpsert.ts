import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

import { Permission, PermissionLevel } from '../../../../signals/loginData';
import { CommonModule } from '@angular/common';
import { Role } from '../roleInterfaces';

@Component({
    selector: 'app-role-edit',
    templateUrl: './roleUpsert.html',
    styleUrl: './roleUpsert.css',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        SelectModule,
        ReactiveFormsModule
    ]
})
export class RoleEditComponent {

    @Input() name!: string;
    @Input() description!: string;

    @Output() cancel = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();

    form!: FormGroup;

    // Opciones del select
    permissionLevels = [
        { label: 'Prohibido', value: PermissionLevel.none },
        { label: 'Lectura', value: PermissionLevel.read },
        { label: 'Escritura', value: PermissionLevel.edit },
        { label: 'Avanzado', value: PermissionLevel.advanced }
    ];

    // Lista de permisos para generar dinámicamente los selects
    permissions = [
        { label: 'Administrador', control: Permission.admin },
        { label: 'Gestión de roles', control: Permission.roles },
        { label: 'Gestión de usuarios', control: Permission.empleados },
        { label: 'Gestión de productos', control: Permission.productos },
        { label: 'Gestión de stock', control: Permission.stock },
        { label: 'Gestión de reservas', control: Permission.reservas },
        { label: 'Gestión de promociones', control: Permission.promociones }
    ];

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.form = this.fb.group({
            name: [this.name ?? ''],

            0: [PermissionLevel.none],
            1: [PermissionLevel.none],
            2: [PermissionLevel.none],
            3: [PermissionLevel.none],
            4: [PermissionLevel.none],
            5: [PermissionLevel.none],
            6: [PermissionLevel.none]
        });
    }

    onSave() {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        }
    }

    onCancel() {
        this.cancel.emit();
    }
}
