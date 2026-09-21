import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as purchaseOrderRepository from '../../src/repositories/purchase-order.repository.js';
import * as purchaseRequestRepository from '../../src/repositories/purchase-request.repository.js';
import * as supplierRepository from '../../src/repositories/supplier.repository.js';

import * as purchaseOrderService from '../../src/services/purchase-order.service.js';

vi.mock('../../src/repositories/purchase-order.repository.js');
vi.mock('../../src/repositories/purchase-request.repository.js');
vi.mock('../../src/repositories/supplier.repository.js');

describe('Purchase Order Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPurchaseOrder', () => {
    it('cannot create Purchase Order from non-approved Purchase Request', async () => {
      vi.mocked(
        purchaseRequestRepository.getPurchaseRequestById
      ).mockResolvedValue({
        id: 1,
        request_number: 'PR-2026-001',
        warehouse_id: 1,
        requested_by: 10,
        status: 'SUBMITTED',
        approved_by: null,
        created_at: new Date(),
        updated_at: new Date(),
        items: [
          {
            id: 1,
            purchase_request_id: 1,
            product_id: 1,
            quantity: 10,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      });

      await expect(
        purchaseOrderService.createPurchaseOrder(10, {
          purchase_request_id: 1,
          supplier_id: 1,
        })
      ).rejects.toMatchObject({
        statusCode: 400,
        code: 'PURCHASE_REQUEST_NOT_APPROVED',
      });

      expect(
        purchaseOrderRepository.createPurchaseOrder
      ).not.toHaveBeenCalled();
    });

    it('cannot create multiple Purchase Orders from the same Purchase Request', async () => {
      vi.mocked(
        purchaseRequestRepository.getPurchaseRequestById
      ).mockResolvedValue({
        id: 1,
        request_number: 'PR-2026-001',
        warehouse_id: 1,
        requested_by: 10,
        status: 'APPROVED',
        approved_by: 20,
        created_at: new Date(),
        updated_at: new Date(),
        items: [
          {
            id: 1,
            purchase_request_id: 1,
            product_id: 1,
            quantity: 10,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
      });

      vi.mocked(
        purchaseOrderRepository.getPurchaseOrdersByCursor
      ).mockResolvedValue({
        data: [
          {
            id: 1,
            po_number: 'PO-2026-001',
            purchase_request_id: 1,
            supplier_id: 1,
            warehouse_id: 1,
            status: 'DRAFT',
            created_at: new Date(),
            updated_at: new Date(),
            items: [],
          },
        ],
        pagination: {
          limit: 1,
          next_cursor: null,
        },
      });

      await expect(
        purchaseOrderService.createPurchaseOrder(10, {
          purchase_request_id: 1,
          supplier_id: 1,
        })
      ).rejects.toMatchObject({
        statusCode: 409,
        code: 'PURCHASE_ORDER_ALREADY_EXISTS',
      });

      expect(
        purchaseOrderRepository.createPurchaseOrder
      ).not.toHaveBeenCalled();

      expect(
        supplierRepository.getSupplierById
      ).not.toHaveBeenCalled();
    });
  });
});