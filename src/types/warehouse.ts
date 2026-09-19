export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateWarehouseRequest {
  code: string;
  name: string;
  location?: string;
}

export interface UpdateWarehouseRequest {
  code?: string;
  name?: string;
  location?: string;
  is_active?: boolean;
}

export interface WarehouseFilter {
  code?: string;
  name?: string;
  location?: string;
  is_active?: boolean;
  cursor?: number;
  limit?: number;
}