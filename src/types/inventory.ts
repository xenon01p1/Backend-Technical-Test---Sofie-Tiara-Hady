export interface Inventory {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface InventoryFilter {
  warehouse_id?: number;
  product_id?: number;
  cursor?: number;
  limit?: number;
}

export interface InventoryPagination {
  limit: number;
  next_cursor: number | null;
}

export interface InventoryListResponse {
  data: Inventory[];
  pagination: InventoryPagination;
}