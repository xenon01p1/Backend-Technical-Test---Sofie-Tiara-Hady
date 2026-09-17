import * as productRepository from '../repositories/product.repository.js';
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '../types/product.js';
import { AppError } from '../utils/app-error.js';

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const existingProduct = await productRepository.getProductBySku(data.sku);

  if (existingProduct) {
    throw new AppError(
      409,
      'PRODUCT_SKU_ALREADY_EXISTS',
      'Product SKU already exists.'
    );
  }

  return productRepository.createProduct(data);
};

export const getProducts = async (): Promise<Product[]> => {
  return productRepository.getProducts();
};

export const getProductById = async (
  id: number
): Promise<Product> => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new AppError(
      404,
      'PRODUCT_NOT_FOUND',
      'Product not found.'
    );
  }

  return product;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest
): Promise<Product> => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new AppError(
      404,
      'PRODUCT_NOT_FOUND',
      'Product not found.'
    );
  }

  if (data.sku !== undefined && data.sku !== product.sku) {
    const existingProduct = await productRepository.getProductBySku(data.sku);

    if (existingProduct && existingProduct.id !== id) {
      throw new AppError(
        409,
        'PRODUCT_SKU_ALREADY_EXISTS',
        'Product SKU already exists.'
      );
    }
  }

  const updatedProduct = await productRepository.updateProduct(id, data);

  if (!updatedProduct) {
    throw new AppError(
      404,
      'PRODUCT_NOT_FOUND',
      'Product not found.'
    );
  }

  return updatedProduct;
};

export const deleteProduct = async (
  id: number
): Promise<Product> => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new AppError(
      404,
      'PRODUCT_NOT_FOUND',
      'Product not found.'
    );
  }

  return productRepository.deactivateProduct(id) as Promise<Product>;
};