import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { hasEmployeePermission, Permission, PermissionLevel } from '../../../../signals/loginData';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-employee-item',
    //template: `<p>Employee works</p>`,
    templateUrl: './employeeItem.html',
    styleUrl: './employeeItem.css',
    standalone: true,
    imports: [
        CardModule,
        CommonModule,
        ButtonModule
    ]
})
export class EmployeeItemComponent {
    @Input() name!: string;
    @Input() description!: string;
    @Input() enabled!: boolean;

    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();
    @Output() restore = new EventEmitter<void>();

    hasPermission() {
        return hasEmployeePermission(Permission.empleados, PermissionLevel.edit)
    }

    onEdit() {
        this.edit.emit();
    }

    onDelete() {
        this.delete.emit();
    }

    onRestore() {
        this.restore.emit();
    }
}
