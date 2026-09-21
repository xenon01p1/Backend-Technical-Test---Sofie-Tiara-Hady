export interface InventoryMovement {
  id: number;
  warehouse_id: number;
  product_id: number;
  movement_type: 'PURCHASE_RECEIPT';
  quantity: number;
  reference: string | null;
  created_at: Date;
}

export interface InventoryMovementFilter {
  warehouse_id?: number;
  product_id?: number;
  cursor?: number;
  limit?: number;
}

export interface InventoryMovementPagination {
  limit: number;
  next_cursor: number | null;
}

export interface InventoryMovementListResponse {
  data: InventoryMovement[];
  pagination: InventoryMovementPagination;
}