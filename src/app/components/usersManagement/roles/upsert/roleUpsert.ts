import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-role-item',
    //template: `<p>Role works</p>`,
    templateUrl: './roleUpsert.html',
    styleUrl: './roleUpsert.css',
    standalone: true,
    imports: [
        CardModule,
        ButtonModule
    ]
})
export class RoleItemComponent {
    @Input() name!: string;
    @Input() description!: string;

    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    onEdit() {
        this.edit.emit();
    }

    onDelete() {
        this.delete.emit();
    }
}
