import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-address-item',
    standalone: true,
    templateUrl: './addressItem.html',
    styleUrls: ['./addressItem.html'],
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule]
})
export class AddressItemComponent {

    @Input() group!: FormGroup;
    @Input() index!: number;
    @Input() canDelete = true;

    @Output() delete = new EventEmitter<void>();
}
