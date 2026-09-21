export const swaggerSpec = {
  openapi: '3.0.3',

  info: {
    title: 'Inventory Procurement API',
    version: '1.0.0',
    description:
      'Backend API for inventory and procurement management.',
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],

  tags: [
    { name: 'Authentication' },
    { name: 'Products' },
    { name: 'Suppliers' },
    { name: 'Warehouses' },
    { name: 'Inventory' },
    { name: 'Inventory Movements' },
    { name: 'Purchase Requests' },
    { name: 'Purchase Orders' },
    { name: 'Goods Receipts' },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },

    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR',
              },
              message: {
                type: 'string',
                example: 'Invalid request.',
              },
            },
          },
        },
      },

      LoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'testuser',
          },
          password: {
            type: 'string',
            example: 'password123',
          },
        },
      },

      RegisterRequest: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: {
            type: 'string',
            example: 'testuser',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'test@example.com',
          },
          password: {
            type: 'string',
            example: 'password123',
          },
          phone: {
            type: 'string',
            example: '08123456789',
          },
        },
      },

      PurchaseRequestItem: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id:
            { type: 'integer', example: 1 },
          quantity:
            { type: 'integer', minimum: 1, example: 100 },
        },
      },

      PurchaseRequest: {
        type: 'object',
        properties: {
          warehouse_id:
            { type: 'integer', example: 1 },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PurchaseRequestItem',
            },
          },
        },
      },

      PurchaseOrder: {
        type: 'object',
        properties: {
          purchase_request_id:
            { type: 'integer', example: 1 },
          supplier_id:
            { type: 'integer', example: 1 },
        },
      },

      GoodsReceipt: {
        type: 'object',
        required: ['purchase_order_id', 'items'],
        properties: {
          purchase_order_id:
            { type: 'integer', example: 1 },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['product_id', 'quantity'],
              properties: {
                product_id:
                  { type: 'integer', example: 1 },
                quantity:
                  { type: 'integer', minimum: 1, example: 50 },
              },
            },
          },
        },
      },
    },
  },

  paths: {
    '/health': {
      get: {
        tags: ['Authentication'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'API is healthy.',
          },
        },
      },
    },

    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a temporary user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterRequest',
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully.' },
          '400': {
            description: 'Validation error.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful.',
          },
          '401': {
            description: 'Invalid credentials.',
          },
        },
      },
    },

    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current user.',
          },
          '401': {
            description: 'Unauthorized.',
          },
        },
      },
    },

    '/products': {
      post: {
        tags: ['Products'],
        summary: 'Create product',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Product created.' },
          '403': { description: 'Forbidden.' },
        },
      },

      get: {
        tags: ['Products'],
        summary: 'List products',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Products retrieved.' },
        },
      },
    },

    '/products/search': {
      get: {
        tags: ['Products'],
        summary: 'Search products',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'name',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'sku',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'unit',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'is_active',
            in: 'query',
            schema: { type: 'boolean' },
          },
          {
            name: 'cursor',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 10,
            },
          },
        ],
        responses: {
          '200': { description: 'Products retrieved.' },
        },
      },
    },

    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Product retrieved.' },
          '404': { description: 'Product not found.' },
        },
      },

      put: {
        tags: ['Products'],
        summary: 'Update product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Product updated.' },
          '403': { description: 'Forbidden.' },
        },
      },

      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Product deleted.' },
        },
      },
    },

    '/suppliers': {
      post: {
        tags: ['Suppliers'],
        summary: 'Create supplier',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Supplier created.' },
        },
      },

      get: {
        tags: ['Suppliers'],
        summary: 'List suppliers',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Suppliers retrieved.' },
        },
      },
    },

    '/suppliers/search': {
      get: {
        tags: ['Suppliers'],
        summary: 'Search suppliers',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'email', in: 'query', schema: { type: 'string' } },
          { name: 'phone', in: 'query', schema: { type: 'string' } },
          {
            name: 'is_active',
            in: 'query',
            schema: { type: 'boolean' },
          },
          {
            name: 'cursor',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Suppliers retrieved.' },
        },
      },
    },

    '/suppliers/{id}': {
      get: {
        tags: ['Suppliers'],
        summary: 'Get supplier by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Supplier retrieved.' },
        },
      },

      put: {
        tags: ['Suppliers'],
        summary: 'Update supplier',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Supplier updated.' },
        },
      },

      delete: {
        tags: ['Suppliers'],
        summary: 'Delete supplier',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Supplier deleted.' },
        },
      },
    },

    '/warehouses': {
      post: {
        tags: ['Warehouses'],
        summary: 'Create warehouse',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Warehouse created.' },
        },
      },

      get: {
        tags: ['Warehouses'],
        summary: 'List warehouses',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Warehouses retrieved.' },
        },
      },
    },

    '/warehouses/search': {
      get: {
        tags: ['Warehouses'],
        summary: 'Search warehouses',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'code', in: 'query', schema: { type: 'string' } },
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'location', in: 'query', schema: { type: 'string' } },
          {
            name: 'is_active',
            in: 'query',
            schema: { type: 'boolean' },
          },
          {
            name: 'cursor',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Warehouses retrieved.' },
        },
      },
    },

    '/warehouses/{id}': {
      get: {
        tags: ['Warehouses'],
        summary: 'Get warehouse by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Warehouse retrieved.' },
        },
      },

      put: {
        tags: ['Warehouses'],
        summary: 'Update warehouse',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Warehouse updated.' },
        },
      },

      delete: {
        tags: ['Warehouses'],
        summary: 'Delete warehouse',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Warehouse deleted.' },
        },
      },
    },

    '/inventory': {
      get: {
        tags: ['Inventory'],
        summary: 'View inventory',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'warehouse_id',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'product_id',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'cursor',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
          },
        ],
        responses: {
          '200': { description: 'Inventory retrieved.' },
        },
      },
    },

    '/inventory/movements': {
      get: {
        tags: ['Inventory Movements'],
        summary: 'View inventory movements',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Inventory movements retrieved.',
          },
        },
      },
    },

    '/purchase-requests': {
      post: {
        tags: ['Purchase Requests'],
        summary: 'Create Purchase Request',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PurchaseRequest',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Purchase Request created.',
          },
        },
      },

      get: {
        tags: ['Purchase Requests'],
        summary: 'List Purchase Requests',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Purchase Requests retrieved.',
          },
        },
      },
    },

    '/purchase-requests/{id}': {
      get: {
        tags: ['Purchase Requests'],
        summary: 'Get Purchase Request',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Request retrieved.' },
        },
      },

      put: {
        tags: ['Purchase Requests'],
        summary: 'Update Purchase Request',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Request updated.' },
        },
      },
    },

    '/purchase-requests/{id}/submit': {
      post: {
        tags: ['Purchase Requests'],
        summary: 'Submit Purchase Request',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Request submitted.' },
        },
      },
    },

    '/purchase-requests/{id}/approve': {
      post: {
        tags: ['Purchase Requests'],
        summary: 'Approve Purchase Request',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Request approved.' },
        },
      },
    },

    '/purchase-requests/{id}/reject': {
      post: {
        tags: ['Purchase Requests'],
        summary: 'Reject Purchase Request',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Request rejected.' },
        },
      },
    },

    '/purchase-orders': {
      post: {
        tags: ['Purchase Orders'],
        summary: 'Create Purchase Order from approved Purchase Request',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PurchaseOrder',
              },
            },
          },
        },
        responses: {
          '201': { description: 'Purchase Order created.' },
        },
      },

      get: {
        tags: ['Purchase Orders'],
        summary: 'List Purchase Orders',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Purchase Orders retrieved.' },
        },
      },
    },

    '/purchase-orders/{id}': {
      get: {
        tags: ['Purchase Orders'],
        summary: 'Get Purchase Order',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Order retrieved.' },
        },
      },
    },

    '/purchase-orders/{id}/order': {
      post: {
        tags: ['Purchase Orders'],
        summary: 'Mark Purchase Order as ordered',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Purchase Order marked as ORDERED.' },
        },
      },
    },

    '/goods-receipts': {
      post: {
        tags: ['Goods Receipts'],
        summary: 'Create Goods Receipt',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GoodsReceipt',
              },
            },
          },
        },
        responses: {
          '201': {
            description:
              'Goods Receipt created and inventory updated.',
          },
          '400': {
            description:
              'Invalid receipt quantity or Purchase Order status.',
          },
        },
      },
    },

    '/goods-receipts/{id}': {
      get: {
        tags: ['Goods Receipts'],
        summary: 'Get Goods Receipt',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          '200': { description: 'Goods Receipt retrieved.' },
          '404': { description: 'Goods Receipt not found.' },
        },
      },
    },
  },
};