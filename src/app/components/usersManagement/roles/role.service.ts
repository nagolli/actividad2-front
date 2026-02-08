
import { Injectable } from '@angular/core';
import { InflatableListService } from '../../../shared/services/InflatableList.service'
import { environment } from '../../../../environments/environment';
import { PostRole, Role } from './roleInterfaces';

@Injectable({ providedIn: 'root' })
export class RoleService extends InflatableListService<Role, PostRole> {

    protected baseUrl = `${environment.apiUrl}/role`;

    protected override fromJson(item: any): Role { return Object.assign(new Role(), item); }
}
