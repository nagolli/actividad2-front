import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CategoryService } from './category.service';
import { Category } from './category.models';
import { Permission, PermissionLevel, hasEmployeePermission } from '../../signals/loginData';

@Component({
  selector: 'app-category',
  templateUrl: './category.html',
  styleUrl: './category.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ]
})
export class CategoryComponent implements OnInit {

  searchTerm = '';
  categories = signal<Category[]>([]);
  private readonly categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories.set(
        categories.map(c => ({ ...c, isEditing: false }))
      );
    });
  }

  get filteredCategories() {
    return this.categories().filter(c =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  hasPermission() {
    return hasEmployeePermission(Permission.productos, PermissionLevel.edit);
  }

  onEdit(category: Category) {
    this.cancelAllEditing();
    category.isEditing = true;
  }

  isEditingAny(): boolean {
    return this.categories().some(c => c.isEditing);
  }

  cancelAllEditing() {
    this.categories().forEach(c => c.isEditing = false);
  }

  onSave(category: Category) {
    if (category.isNew) {
      this.categoryService.createCategory(category).subscribe(saved => {
        category.id = saved.id;
        category.isNew = false;
        category.isEditing = false;
      });
    } else {
      this.categoryService.updateCategory(category).subscribe(() => {
        category.isEditing = false;
      });
    }
  }

  onNew() {
    this.cancelAllEditing();

    const newCategory: Category = {
      name: '',
      isEditing: true,
      isNew: true
    };

    this.categories.update(list => [newCategory, ...list]);
  }

  onDelete(category: Category) {
    if (!category.id) return;
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      this.categories.update(list =>
        list.filter(c => c !== category)
      );
    });
  }
}
