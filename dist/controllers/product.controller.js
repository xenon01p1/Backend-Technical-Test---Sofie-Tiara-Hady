import * as productService from '../services/product.service.js';
import { createProductSchema, productIdSchema, updateProductSchema, productFilterSchema, } from '../validators/product.validator.js';
import { logRequest } from "../utils/logger.js";
export const createProduct = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const data = createProductSchema.parse(req.body);
        const product = await productService.createProduct(data);
        logRequest('POST', '/products', true, `Created product id=${product.id}`, startTime);
        res.status(201).json({
            data: product,
        });
    }
    catch (error) {
        logRequest('POST', '/products', false, 'Request failed', startTime);
        next(error);
    }
};
export const getProducts = async (_req, res, next) => {
    const startTime = Date.now();
    try {
        const products = await productService.getProducts();
        logRequest('GET', '/products', true, `count=${products.length}`, startTime);
        res.status(200).json({
            data: products,
        });
    }
    catch (error) {
        logRequest('GET', '/products', false, 'Request failed', startTime);
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const id = productIdSchema.parse(req.params.id);
        const product = await productService.getProductById(id);
        logRequest('GET', `/products/${id}`, true, 'Found product', startTime);
        res.status(200).json({
            data: product,
        });
    }
    catch (error) {
        logRequest('GET', `/products/${req.params.id}`, false, 'Request failed', startTime);
        next(error);
    }
};
export const updateProduct = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const id = productIdSchema.parse(req.params.id);
        const data = updateProductSchema.parse(req.body);
        const product = await productService.updateProduct(id, data);
        logRequest('PUT', `/products/${id}`, true, 'Updated product', startTime);
        res.status(200).json({
            data: product,
        });
    }
    catch (error) {
        logRequest('PUT', `/products/${req.params.id}`, false, 'Request failed', startTime);
        next(error);
    }
};
export const deleteProduct = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const id = productIdSchema.parse(req.params.id);
        const product = await productService.deleteProduct(id);
        logRequest('DELETE', `/products/${id}`, true, `Deleted product id=${id}`, startTime);
        res.status(200).json({
            data: product,
        });
    }
    catch (error) {
        logRequest('DELETE', `/products/${req.params.id}`, false, 'Request failed', startTime);
        next(error);
    }
};
export const getProductsByCursor = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const filter = productFilterSchema.parse(req.query);
        const products = await productService.getProductsByCursor(filter);
        logRequest('GET', '/products/search', true, `count=${products.length}`, startTime);
        res.status(200).json({
            data: products,
        });
    }
    catch (error) {
        logRequest('GET', '/products/search', false, 'Request failed', startTime);
        next(error);
    }
};
