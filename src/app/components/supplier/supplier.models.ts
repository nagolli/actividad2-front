export interface Supplier {
  id?: number;
  name: string;
  phone: string;
  email: string;
  inactive: number;
  isEditing?: boolean;
  isNew?: boolean;
}