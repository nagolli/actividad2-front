import { Component, OnInit, signal } from '@angular/core';
import { EmployeeItemComponent } from '../item/employeeItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PostEmployee, Employee } from '../employeeInterfaces';
import { EmployeeService } from '../employee.service';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Permission, PermissionLevel, hasEmployeePermission } from '../../../../signals/loginData';

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

    constructor(private employeeService: EmployeeService) { }

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
        let newItem = this.employees().find(e => e.id == 0)
        if (newItem) {
            //Reiniciar el que se esta creando nuevo
            this.onCancel(newItem);
            this.onNew();
        } else {
            //Nuevo campo
            this.employees().unshift(new Employee())
            this.employees.set([...this.employees()])
            setTimeout(() => {
                //Asegurar que se ve el nuevo campo
                const el = document.getElementById('newItem');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100)
        }
    }

    editingEmployee = signal<number | null>(null);

    onEdit(employee: Employee) {
        this.editingEmployee.set(employee.id);
    }


    onDelete(employee: Employee) {
        console.log("Dando de baja");
        this.employeeService.setEnabled(employee.id, false,
            () => setTimeout(() => {
                this.loadEmployees();
            }, 100),
            (ev) => {
                console.log("Error actualizando empleado", ev)
            }).subscribe();
    }

    onRestore(employee: Employee) {
        console.log("Dando de alta");
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
