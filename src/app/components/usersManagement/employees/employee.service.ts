
import { Injectable } from '@angular/core';
import { InflatableListService } from '../../../shared/services/InflatableList.service'
import { environment } from '../../../../environments/environment';
import { Employee, PostEmployee } from './employeeInterfaces';

@Injectable({ providedIn: 'root' })
export class EmployeeService extends InflatableListService<Employee, PostEmployee> {

    protected baseUrl = `${environment.apiUrl}/employee`;

    protected override fromJson(item: any): Employee {
        let result = Object.assign(new Employee(), item);
        result.enabled = !item.isInactive
        return result;
    }
}
