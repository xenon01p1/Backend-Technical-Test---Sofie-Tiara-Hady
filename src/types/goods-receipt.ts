export interface GoodsReceiptItem {
  id: number;
  goods_receipt_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface GoodsReceipt {
  id: number;
  goods_receipt_number: string;
  purchase_order_id: number;
  created_at: Date;
  updated_at: Date;
  items: GoodsReceiptItem[];
}

export interface CreateGoodsReceiptItem {
  product_id: number;
  quantity: number;
}

export interface CreateGoodsReceiptRequest {
  purchase_order_id: number;
  items: CreateGoodsReceiptItem[];
}