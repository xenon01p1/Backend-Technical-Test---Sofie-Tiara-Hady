import * as productRepository from '../repositories/product.repository.js';
import { AppError } from '../utils/app-error.js';
export const createProduct = async (data) => {
    const existingProduct = await productRepository.getProductBySku(data.sku);
    if (existingProduct) {
        throw new AppError(409, 'PRODUCT_SKU_ALREADY_EXISTS', 'Product SKU already exists.');
    }
    return productRepository.createProduct(data);
};
export const getProductsByCursor = async (filter) => {
    return productRepository.getProductsByCursor(filter);
};
export const getProducts = async () => {
    return productRepository.getProducts();
};
export const getProductById = async (id) => {
    const product = await productRepository.getProductById(id);
    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }
    return product;
};
export const updateProduct = async (id, data) => {
    const product = await productRepository.getProductById(id);
    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }
    if (data.sku !== undefined && data.sku !== product.sku) {
        const existingProduct = await productRepository.getProductBySku(data.sku);
        if (existingProduct && existingProduct.id !== id) {
            throw new AppError(409, 'PRODUCT_SKU_ALREADY_EXISTS', 'Product SKU already exists.');
        }
    }
    const updatedProduct = await productRepository.updateProduct(id, data);
    if (!updatedProduct) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }
    return updatedProduct;
};
export const deleteProduct = async (id) => {
    const product = await productRepository.getProductById(id);
    if (!product) {
        throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }
    await productRepository.deleteProduct(id);
    return product;
};
