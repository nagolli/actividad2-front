import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeeItemComponent } from '../item/employeeItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PostEmployee, Employee } from '../employeeInterfaces';
import { EmployeeService } from '../employee.service';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Permission, PermissionLevel, hasEmployeePermission } from '../../../../signals/loginData';
import { Router } from '@angular/router';
import { UserComponentMode } from '../../register/userForm';
import { UserCallbackService } from '../../register/userCallback.service';

@Component({
    selector: 'app-employees-list',
    templateUrl: './employeeList.html',
    styleUrls: ['./employeeList.css', '../../../../shared/styles/cardContainer.css', '../../../../shared/styles/searchContainer.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, EmployeeItemComponent, ButtonModule, DialogModule, SelectModule]
})
export class EmployeeListComponent implements OnInit {

    tableName = "Empleados"

    searchTerm = '';
    employees = signal<Employee[]>([]);
    private readonly router = inject(Router);

    constructor(private employeeService: EmployeeService, private callback: UserCallbackService) { }

    hasPermission() {
        return hasEmployeePermission(Permission.empleados, PermissionLevel.edit)
    }

    ngOnInit(): void {
        this.loadEmployees();
    }

    loadEmployees(): void {
        this.employeeService.getList(
            data => {
                this.employees.set(data);
            },
            err => {
                console.error('Error cargando employees', err)
            }
        ).subscribe();
    }

    get filteredEmployees() {
        return this.employees().filter(r =>
            r.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    onNew() {
        //Establecer función de callback:
        this.callback.onSuccess = (user, address, roles) => {
            //En el ok volver a esta vista
            console.log(user, address, roles);
            this.router.navigate(['/employees'])
        };
        this.callback.onCancel = () => {
            //En el cancel volver a esta vista
            this.router.navigate(['/employees'])
        };

        //Navegar a edicion de usuario, modo admin
        this.router.navigate(['/user', UserComponentMode.registerEmployee])

    }

    editingEmployee = signal<number | null>(null);

    onEdit(employee: Employee) {
        //Navegar a edicion de usuario, modo admin
        this.editingEmployee.set(employee.id);
        //En el ok volver a esta vista

    }


    onDelete(employee: Employee) {
        this.employeeService.setEnabled(employee.id, false,
            () => setTimeout(() => {
                this.loadEmployees();
            }, 100),
            (ev) => {
                console.log("Error actualizando empleado", ev)
            }).subscribe();
    }

    onRestore(employee: Employee) {
        this.employeeService.setEnabled(employee.id, true,
            () => setTimeout(() => {
                this.loadEmployees();
            }, 100),
            (ev) => {
                console.log("Error actualizando empleado", ev)
            }).subscribe();
    }

    onCancel(employee: Employee | PostEmployee) {
        if (employee.id == 0) {
            this.employees.set([...this.employees().filter(e => e.id > 0)])
        } else {
            this.editingEmployee.set(null);
        }
    }

    onSave(values: any) {
        const employee = new PostEmployee();
        employee.id = values.id || 0;
        employee.name = values.name;
        if (employee.id == 0) {
            this.employeeService.create(employee, () => setTimeout(() => {
                this.onCancel(employee);
                this.loadEmployees()
            }, 100), (ev) => {
                console.log("Error creando empleado", ev)
            }).subscribe();
        } else {
            this.employeeService.update(employee.id, employee, () => setTimeout(() => {
                this.onCancel(employee);
                this.loadEmployees()
            }, 100), (ev) => {
                console.log("Error actualizando empleado", ev)
            }).subscribe();
        }
    }
}
