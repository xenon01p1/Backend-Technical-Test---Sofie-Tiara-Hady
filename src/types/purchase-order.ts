export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'ORDERED'
  | 'PARTIALLY_RECEIVED'
  | 'RECEIVED'
  | 'CANCELLED';

export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  ordered_quantity: number;
  received_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  purchase_request_id: number;
  supplier_id: number;
  warehouse_id: number;
  status: PurchaseOrderStatus;
  created_at: Date;
  updated_at: Date;
  items: PurchaseOrderItem[];
}

export interface CreatePurchaseOrderRequest {
  purchase_request_id: number;
  supplier_id: number;
}

export interface PurchaseOrderFilter {
  status?: PurchaseOrderStatus;
  supplier_id?: number;
  purchase_request_id?: number;
  requested_by?: number;
  cursor?: number;
  limit?: number;
}

export interface PurchaseOrderPagination {
  limit: number;
  next_cursor: number | null;
}

export interface PurchaseOrderListResponse {
  data: PurchaseOrder[];
  pagination: PurchaseOrderPagination;
}