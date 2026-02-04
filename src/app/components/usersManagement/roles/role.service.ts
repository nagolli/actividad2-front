
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly http = inject(HttpClient);

}