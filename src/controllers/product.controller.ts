import type { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service.js';
import {
  createProductSchema,
  productIdSchema,
  updateProductSchema,
} from '../validators/product.validator.js';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await productService.createProduct(data);

    res.status(201).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await productService.getProducts();

    res.status(200).json({
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = productIdSchema.parse(req.params.id);

    const product = await productService.getProductById(id);

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = productIdSchema.parse(req.params.id);
    const data = updateProductSchema.parse(req.body);

    const product = await productService.updateProduct(id, data);

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = productIdSchema.parse(req.params.id);

    const product = await productService.deleteProduct(id);

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};