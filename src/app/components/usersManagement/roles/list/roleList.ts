import { Component, OnInit, signal } from '@angular/core';
import { RoleItemComponent } from '../item/roleItem';
import { RoleEditComponent } from '../upsert/roleUpsert';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PostRole, Role } from '../roleInterfaces';
import { RoleService } from '../role.service';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Permission, PermissionLevel, hasEmployeePermission } from '../../../../signals/loginData';

@Component({
    selector: 'app-roles-list',
    templateUrl: './roleList.html',
    styleUrls: ['./roleList.css', '../../../../shared/styles/cardContainer.css', '../../../../shared/styles/searchContainer.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RoleItemComponent, RoleEditComponent, ButtonModule, DialogModule, SelectModule]
})
export class RoleListComponent implements OnInit {

    tableName = "Roles"

    searchTerm = '';
    roles = signal<Role[]>([]);

    constructor(private roleService: RoleService) { }

    hasPermission() {
        return hasEmployeePermission(Permission.roles, PermissionLevel.edit)
    }

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.roleService.getList(
            data => {
                this.roles.set(data);
            },
            err => {
                console.error('Error cargando roles', err)
            }
        ).subscribe();
    }

    get filteredRoles() {
        return this.roles().filter(r =>
            r.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    onNew() {
        let newItem = this.roles().find(e => e.id == 0)
        if (newItem) {
            //Reiniciar el que se esta creando nuevo
            this.onCancel(newItem);
            this.onNew();
        } else {
            //Nuevo campo
            this.roles().unshift(new Role())
            this.roles.set([...this.roles()])
            setTimeout(() => {
                //Asegurar que se ve el nuevo campo
                const el = document.getElementById('newItem');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100)
        }
    }

    onEdit(role: Role) {
        console.log('Editar', role);
    }

    showReplaceModal = false;
    selectedRoleId: number | null = null;
    roleToDelete!: Role;

    remainingRoles() {
        return this.roles().filter(e => e.id != this.roleToDelete?.id)
    }

    onDelete(role: Role) {
        this.roleToDelete = role;
        this.selectedRoleId = null;

        // Abrir modal
        this.showReplaceModal = true;
    }

    confirmDelete() {
        if (!this.selectedRoleId) return;

        this.roleService.delete(
            this.roleToDelete.id,
            data => {
                this.showReplaceModal = false;
                this.loadRoles();
            },
            err => {
                console.error('Error borrando rol', err);
            },
            this.selectedRoleId
        ).subscribe();
    }

    onCancel(role: Role | PostRole) {
        if (role.id == 0) {
            this.roles.set([...this.roles().filter(e => e.id > 0)])
        } else {

        }
    }

    onSave(values: any) {
        const role = new PostRole();
        role.name = values.name;
        role.permissions = [
            { permissionId: Permission.admin, permissionLevel: values[0] },
            { permissionId: Permission.roles, permissionLevel: values[1] },
            { permissionId: Permission.stock, permissionLevel: values[2] },
            { permissionId: Permission.productos, permissionLevel: values[3] },
            { permissionId: Permission.reservas, permissionLevel: values[4] },
            { permissionId: Permission.promociones, permissionLevel: values[5] },
            { permissionId: Permission.empleados, permissionLevel: values[6] }
        ].filter(e => e.permissionLevel > 0);
        if (role.id == 0) {
            this.roleService.create(role, () => setTimeout(() => {
                this.onCancel(role);
                this.loadRoles()
            }, 100), (ev) => {
                console.log("Error creando rol", ev)
            }).subscribe();
        } else {

        }
    }
}
