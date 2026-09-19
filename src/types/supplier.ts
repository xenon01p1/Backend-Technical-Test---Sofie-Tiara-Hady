export interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSupplierRequest {
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
}

export interface SupplierFilter {
  name?: string;
  email?: string;
  phone?: string;
  is_active?: boolean;
  cursor?: number;
  limit?: number;
}