import { Component, OnInit, signal } from '@angular/core';
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
  selectedSuppliers = new Set<number>();

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      this.suppliers.set(suppliers);
    })
  }

  get filteredSuppliers() {
    return this.suppliers().filter(s =>
      s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.phone.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  hasPermission() {
    return hasEmployeePermission(Permission.productos, PermissionLevel.edit)
  }

  hasDeletePermission() {
    return hasEmployeePermission(Permission.productos, PermissionLevel.advanced)
  }

  onNew() {
    console.log('Crear nuevo proveedor');
  }

  onEdit(supplier: Supplier) {
    console.log('Editar proveedor', supplier);
  }

  onDelete(supplier: Supplier) {
    console.log('Eliminar proveedor', supplier);
  }

  toggleInactive(supplier: Supplier) {
    supplier.inactive = supplier.inactive ? 0 : 1;
  }
}


