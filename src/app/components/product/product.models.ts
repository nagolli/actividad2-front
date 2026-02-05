export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  stock: number;
  image: string;
  inactive: number;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  supplierId: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductFilters {
  name: string;
  category: number;
  supplier: number;
  min: number;
  max: number;
}
