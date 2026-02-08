import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { hasEmployeePermission, Permission, PermissionLevel } from '../../../../signals/loginData';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-role-item',
    //template: `<p>Role works</p>`,
    templateUrl: './roleItem.html',
    styleUrl: './roleItem.css',
    standalone: true,
    imports: [
        CardModule,
        CommonModule,
        ButtonModule
    ]
})
export class RoleItemComponent {
    @Input() name!: string;
    @Input() description!: string;

    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    hasPermission() {
        return hasEmployeePermission(Permission.roles, PermissionLevel.edit)
    }
    hasExtraPermission() {
        return hasEmployeePermission(Permission.roles, PermissionLevel.advanced)
    }

    onEdit() {
        this.edit.emit();
    }

    onDelete() {
        this.delete.emit();
    }
}
