import * as purchaseOrderRepository from '../repositories/purchase-order.repository.js';
import * as purchaseRequestRepository from '../repositories/purchase-request.repository.js';
import * as supplierRepository from '../repositories/supplier.repository.js';

import type {
  CreatePurchaseOrderRequest,
  PurchaseOrderFilter,
} from '../types/purchase-order.js';

import { AppError } from '../utils/app-error.js';

const generatePoNumber = (): string => {
  const timestamp = Date.now();

  return `PO-${new Date().getFullYear()}-${timestamp}`;
};

export const createPurchaseOrder = async (
  userId: number,
  data: CreatePurchaseOrderRequest
) => {
  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(
      data.purchase_request_id
    );

  if (!purchaseRequest) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  if (purchaseRequest.requested_by !== userId) {
    throw new AppError(
      403,
      'PURCHASE_ORDER_FORBIDDEN',
      'You are not allowed to create a Purchase Order from this Purchase Request.'
    );
  }

  if (purchaseRequest.status !== 'APPROVED') {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_NOT_APPROVED',
      'Purchase Order can only be created from an APPROVED Purchase Request.'
    );
  }

  if (purchaseRequest.items.length === 0) {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_EMPTY',
      'Purchase Request must contain at least one item.'
    );
  }

  const existingPurchaseOrders =
    await purchaseOrderRepository.getPurchaseOrdersByCursor({
      purchase_request_id: data.purchase_request_id,
      limit: 1,
    });

  if (existingPurchaseOrders.data.length > 0) {
    throw new AppError(
      409,
      'PURCHASE_ORDER_ALREADY_EXISTS',
      'This Purchase Request already has a Purchase Order.'
    );
  }

  const supplier = await supplierRepository.getSupplierById(
    data.supplier_id
  );

  if (!supplier) {
    throw new AppError(
      404,
      'SUPPLIER_NOT_FOUND',
      'Supplier not found.'
    );
  }

  if (!supplier.is_active) {
    throw new AppError(
      400,
      'SUPPLIER_INACTIVE',
      'Inactive suppliers cannot be used for new Purchase Orders.'
    );
  }

  const poNumber = generatePoNumber();

  const items = purchaseRequest.items.map((item) => ({
    product_id: item.product_id,
    ordered_quantity: item.quantity,
  }));

  return purchaseOrderRepository.createPurchaseOrder(
    poNumber,
    data,
    purchaseRequest.warehouse_id,
    items
  );
};

export const getPurchaseOrders = async (
  userId: number,
  role: 'USER' | 'APPROVER' | 'ADMIN',
  filter: PurchaseOrderFilter
) => {
  if (role === 'USER') {
    return purchaseOrderRepository.getPurchaseOrdersByCursor({
        ...filter,
        requested_by: userId,
    });
    }

  return purchaseOrderRepository.getPurchaseOrdersByCursor(filter);
};

export const getPurchaseOrderById = async (
  id: number,
  userId: number,
  role: 'USER' | 'APPROVER' | 'ADMIN'
) => {
  const purchaseOrder =
    await purchaseOrderRepository.getPurchaseOrderById(id);

  if (!purchaseOrder) {
    throw new AppError(
      404,
      'PURCHASE_ORDER_NOT_FOUND',
      'Purchase Order not found.'
    );
  }

  if (role === 'USER') {
    const purchaseRequest =
      await purchaseRequestRepository.getPurchaseRequestById(
        purchaseOrder.purchase_request_id
      );

    if (
      !purchaseRequest ||
      purchaseRequest.requested_by !== userId
    ) {
      throw new AppError(
        403,
        'PURCHASE_ORDER_FORBIDDEN',
        'You are not allowed to access this Purchase Order.'
      );
    }
  }

  return purchaseOrder;
};

export const markPurchaseOrderAsOrdered = async (
  id: number,
  userId: number
) => {
  const purchaseOrder =
    await purchaseOrderRepository.getPurchaseOrderById(id);

  if (!purchaseOrder) {
    throw new AppError(
      404,
      'PURCHASE_ORDER_NOT_FOUND',
      'Purchase Order not found.'
    );
  }

  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(
      purchaseOrder.purchase_request_id
    );

  if (
    !purchaseRequest ||
    purchaseRequest.requested_by !== userId
  ) {
    throw new AppError(
      403,
      'PURCHASE_ORDER_FORBIDDEN',
      'You are not allowed to order this Purchase Order.'
    );
  }

  if (purchaseOrder.status !== 'DRAFT') {
    throw new AppError(
      400,
      'INVALID_PURCHASE_ORDER_STATUS',
      'Only DRAFT Purchase Orders can be marked as ORDERED.'
    );
  }

  return purchaseOrderRepository.updatePurchaseOrderStatus(
    id,
    'ORDERED'
  );
};