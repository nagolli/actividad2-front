export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  inactive: number;
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

export interface SearchFilter {
  query: string;
}
