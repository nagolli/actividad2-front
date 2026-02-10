import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SupplierService } from './supplier.service';
import { Supplier } from './supplier.models';
import { Permission, PermissionLevel, hasEmployeePermission } from '../../signals/loginData';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule
  ]
})
export class SupplierComponent implements OnInit {

  searchTerm = '';
  suppliers = signal<Supplier[]>([]);
  private readonly supplierService = inject(SupplierService);

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      this.suppliers.set(
        suppliers.map(s => ({ ...s, isEditing: false }))
      );
    });
  }

  get filteredSuppliers() {
    return this.suppliers().filter(s =>
      s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  hasPermission() {
    return hasEmployeePermission(Permission.productos, PermissionLevel.edit);
  }

  onEdit(supplier: Supplier) {
    this.cancelAllEditing();
    supplier.isEditing = true;
  }

  isEditingAny(): boolean {
    return this.suppliers().some(s => s.isEditing);
  }

  cancelAllEditing() {
    this.suppliers().forEach(s => s.isEditing = false);
  }

  onSave(supplier: Supplier) {
    if (supplier.isNew) {
      this.supplierService.createSupplier(supplier).subscribe(saved => {
        supplier.id = saved.id;
        supplier.isNew = false;
        supplier.isEditing = false;
      });
    } else {
      this.supplierService.updateSupplier(supplier).subscribe(() => {
        supplier.isEditing = false;
      });
    }
  }

  onNew() {
    this.cancelAllEditing();

    const newSupplier: Supplier = {
      name: '',
      email: '',
      phone: '',
      inactive: 0,
      isEditing: true,
      isNew: true
    };

    this.suppliers.update(list => [newSupplier, ...list]);
  }

  onDelete(supplier: Supplier) {
    if (!supplier.id) return;
    this.supplierService.deleteSupplier(supplier.id).subscribe(() => {
      this.suppliers.update(list =>
        list.filter(s => s !== supplier)
      );
    });
  }
}



