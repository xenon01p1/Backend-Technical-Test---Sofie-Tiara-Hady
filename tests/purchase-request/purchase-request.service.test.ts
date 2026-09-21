import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as purchaseRequestRepository from '../../src/repositories/purchase-request.repository.js';
import * as purchaseRequestService from '../../src/services/purchase-request.service.js';

vi.mock('../../src/repositories/purchase-request.repository.js');

describe('Purchase Request Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('submitPurchaseRequest', () => {
    it('cannot submit Purchase Request without items', async () => {
      vi.mocked(
        purchaseRequestRepository.getPurchaseRequestById
      ).mockResolvedValue({
        id: 1,
        request_number: 'PR-2026-001',
        warehouse_id: 1,
        requested_by: 10,
        status: 'DRAFT',
        approved_by: null,
        created_at: new Date(),
        updated_at: new Date(),
        items: [],
      });

      await expect(
        purchaseRequestService.submitPurchaseRequest(1, 10)
      ).rejects.toMatchObject({
        statusCode: 400,
        code: 'PURCHASE_REQUEST_EMPTY',
      });

      expect(
        purchaseRequestRepository.updatePurchaseRequestStatus
      ).not.toHaveBeenCalled();
    });
  });

  describe('approvePurchaseRequest', () => {
    it('cannot approve Purchase Request that is not SUBMITTED', async () => {
      vi.mocked(
        purchaseRequestRepository.getPurchaseRequestById
      ).mockResolvedValue({
        id: 1,
        request_number: 'PR-2026-001',
        warehouse_id: 1,
        requested_by: 10,
        status: 'DRAFT',
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
        purchaseRequestService.approvePurchaseRequest(1, 20)
      ).rejects.toMatchObject({
        statusCode: 400,
        code: 'PURCHASE_REQUEST_NOT_SUBMITTED',
      });

      expect(
        purchaseRequestRepository.updatePurchaseRequestStatus
      ).not.toHaveBeenCalled();
    });
  });
});