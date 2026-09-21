export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED';

export interface PurchaseRequestItem {
  id: number;
  purchase_request_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface PurchaseRequest {
  id: number;
  request_number: string;
  warehouse_id: number;
  requested_by: number;
  status: PurchaseRequestStatus;
  approved_by: number | null;
  created_at: Date;
  updated_at: Date;
  items: PurchaseRequestItem[];
}

export interface CreatePurchaseRequestItem {
  product_id: number;
  quantity: number;
}

export interface CreatePurchaseRequestRequest {
  warehouse_id: number;
  items: CreatePurchaseRequestItem[];
}

export interface UpdatePurchaseRequestRequest {
  warehouse_id?: number;
  items?: CreatePurchaseRequestItem[];
}

export interface PurchaseRequestFilter {
  status?: PurchaseRequestStatus;
  requested_by?: number;
  cursor?: number;
  limit?: number;
}

export interface PurchaseRequestPagination {
  limit: number;
  next_cursor: number | null;
}

export interface PurchaseRequestListResponse {
  data: PurchaseRequest[];
  pagination: PurchaseRequestPagination;
}