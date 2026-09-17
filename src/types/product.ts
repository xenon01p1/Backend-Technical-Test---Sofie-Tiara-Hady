export interface Product {
  id: number;
  sku: string;
  name: string;
  unit: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  unit: string;
}

export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  unit?: string;
  is_active?: boolean;
}