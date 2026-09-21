import * as purchaseRequestRepository from '../repositories/purchase-request.repository.js';
import * as warehouseRepository from '../repositories/warehouse.repository.js';
import * as productRepository from '../repositories/product.repository.js';

import type { PurchaseRequest } from '../types/purchase-request.js';
import type {
  CreatePurchaseRequestRequest,
  PurchaseRequestFilter,
  UpdatePurchaseRequestRequest,
} from '../types/purchase-request.js';

import { AppError } from '../utils/app-error.js';

const generateRequestNumber = (): string => {
  const timestamp = Date.now();

  return `PR-${new Date().getFullYear()}-${timestamp}`;
};

export const createPurchaseRequest = async (
  requestedBy: number,
  data: CreatePurchaseRequestRequest
): Promise<PurchaseRequest> => {
  const warehouse =
    await warehouseRepository.getWarehouseById(data.warehouse_id);

  if (!warehouse) {
    throw new AppError(
      404,
      'WAREHOUSE_NOT_FOUND',
      'Warehouse not found.'
    );
  }

  if (!warehouse.is_active) {
    throw new AppError(
      400,
      'WAREHOUSE_INACTIVE',
      'Warehouse is inactive.'
    );
  }

  for (const item of data.items) {
    const product =
      await productRepository.getProductById(item.product_id);

    if (!product) {
      throw new AppError(
        404,
        'PRODUCT_NOT_FOUND',
        `Product ${item.product_id} not found.`
      );
    }

    if (!product.is_active) {
      throw new AppError(
        400,
        'PRODUCT_INACTIVE',
        `Product ${item.product_id} is inactive.`
      );
    }
  }

  const requestNumber = generateRequestNumber();

  return purchaseRequestRepository.createPurchaseRequest(
    requestNumber,
    requestedBy,
    data
  );
};

export const getPurchaseRequests = async (
  filter: PurchaseRequestFilter
) => {
  return purchaseRequestRepository.getPurchaseRequestsByCursor(
    filter
  );
};

export const getPurchaseRequestById = async (
  id: number
): Promise<PurchaseRequest> => {
  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(id);

  if (!purchaseRequest) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  return purchaseRequest;
};

export const updatePurchaseRequest = async (
  id: number,
  requestedBy: number,
  data: UpdatePurchaseRequestRequest
): Promise<PurchaseRequest> => {
  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(id);

  if (!purchaseRequest) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  if (purchaseRequest.requested_by !== requestedBy) {
    throw new AppError(
      403,
      'FORBIDDEN',
      'You can only update your own Purchase Request.'
    );
  }

  if (purchaseRequest.status !== 'DRAFT') {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_NOT_DRAFT',
      'Only DRAFT Purchase Requests can be updated.'
    );
  }

  if (data.warehouse_id !== undefined) {
    const warehouse =
      await warehouseRepository.getWarehouseById(
        data.warehouse_id
      );

    if (!warehouse) {
      throw new AppError(
        404,
        'WAREHOUSE_NOT_FOUND',
        'Warehouse not found.'
      );
    }

    if (!warehouse.is_active) {
      throw new AppError(
        400,
        'WAREHOUSE_INACTIVE',
        'Warehouse is inactive.'
      );
    }
  }

  if (data.items !== undefined) {
    for (const item of data.items) {
      const product =
        await productRepository.getProductById(item.product_id);

      if (!product) {
        throw new AppError(
          404,
          'PRODUCT_NOT_FOUND',
          `Product ${item.product_id} not found.`
        );
      }

      if (!product.is_active) {
        throw new AppError(
          400,
          'PRODUCT_INACTIVE',
          `Product ${item.product_id} is inactive.`
        );
      }
    }
  }

  const updated =
    await purchaseRequestRepository.updatePurchaseRequest(
      id,
      data
    );

  if (!updated) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  return updated;
};

export const submitPurchaseRequest = async (
  id: number,
  requestedBy: number
): Promise<PurchaseRequest> => {
  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(id);

  if (!purchaseRequest) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  if (purchaseRequest.requested_by !== requestedBy) {
    throw new AppError(
      403,
      'FORBIDDEN',
      'You can only submit your own Purchase Request.'
    );
  }

  if (purchaseRequest.status !== 'DRAFT') {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_NOT_DRAFT',
      'Only DRAFT Purchase Requests can be submitted.'
    );
  }

  if (purchaseRequest.items.length === 0) {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_EMPTY',
      'Purchase Request must have at least one item.'
    );
  }

  const submitted =
    await purchaseRequestRepository.updatePurchaseRequestStatus(
      id,
      'SUBMITTED'
    );

  if (!submitted) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  return submitted;
};

export const approvePurchaseRequest = async (
  id: number,
  approvedBy: number
): Promise<PurchaseRequest> => {
  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(id);

  if (!purchaseRequest) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  if (purchaseRequest.status !== 'SUBMITTED') {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_NOT_SUBMITTED',
      'Only SUBMITTED Purchase Requests can be approved.'
    );
  }

  const approved =
    await purchaseRequestRepository.updatePurchaseRequestStatus(
      id,
      'APPROVED',
      approvedBy
    );

  if (!approved) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  return approved;
};

export const rejectPurchaseRequest = async (
  id: number
): Promise<PurchaseRequest> => {
  const purchaseRequest =
    await purchaseRequestRepository.getPurchaseRequestById(id);

  if (!purchaseRequest) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  if (purchaseRequest.status !== 'SUBMITTED') {
    throw new AppError(
      400,
      'PURCHASE_REQUEST_NOT_SUBMITTED',
      'Only SUBMITTED Purchase Requests can be rejected.'
    );
  }

  const rejected =
    await purchaseRequestRepository.updatePurchaseRequestStatus(
      id,
      'REJECTED'
    );

  if (!rejected) {
    throw new AppError(
      404,
      'PURCHASE_REQUEST_NOT_FOUND',
      'Purchase Request not found.'
    );
  }

  return rejected;
};