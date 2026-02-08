import { Component, OnInit, signal } from '@angular/core';
import { RoleItemComponent } from '../item/roleItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Role } from '../roleInterfaces';
import { RoleService } from '../role.service';

@Component({
    selector: 'app-roles-list',
    templateUrl: './roleList.html',
    styleUrls: ['./roleList.css', '../../../../shared/styles/cardContainer.css', '../../../../shared/styles/searchContainer.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RoleItemComponent, ButtonModule]
})
export class RoleListComponent implements OnInit {

    tableName = "Roles"

    searchTerm = '';
    roles = signal<Role[]>([]);

    constructor(private roleService: RoleService) { }

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
        console.log('Nuevo');
    }

    onEdit(role: Role) {
        console.log('Editar', role);
    }

    onDelete(role: Role) {
        this.roleService.delete(role.id,
            data => {
                this.loadRoles();
            },
            err => {
                console.error('Error borrando rol', err)
            }).subscribe();
    }
}
