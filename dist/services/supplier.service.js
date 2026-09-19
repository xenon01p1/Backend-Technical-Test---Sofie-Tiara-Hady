import * as supplierRepository from '../repositories/supplier.repository.js';
import { AppError } from '../utils/app-error.js';
export const createSupplier = async (data) => {
    return supplierRepository.createSupplier(data);
};
export const getSuppliers = async () => {
    return supplierRepository.getSuppliers();
};
export const getSuppliersByCursor = async (filter) => {
    return supplierRepository.getSuppliersByCursor(filter);
};
export const getSupplierById = async (id) => {
    const supplier = await supplierRepository.getSupplierById(id);
    if (!supplier) {
        throw new AppError(404, 'SUPPLIER_NOT_FOUND', 'Supplier not found.');
    }
    return supplier;
};
export const updateSupplier = async (id, data) => {
    const supplier = await supplierRepository.getSupplierById(id);
    if (!supplier) {
        throw new AppError(404, 'SUPPLIER_NOT_FOUND', 'Supplier not found.');
    }
    const updatedSupplier = await supplierRepository.updateSupplier(id, data);
    if (!updatedSupplier) {
        throw new AppError(404, 'SUPPLIER_NOT_FOUND', 'Supplier not found.');
    }
    return updatedSupplier;
};
export const deleteSupplier = async (id) => {
    const supplier = await supplierRepository.getSupplierById(id);
    if (!supplier) {
        throw new AppError(404, 'SUPPLIER_NOT_FOUND', 'Supplier not found.');
    }
    await supplierRepository.deleteSupplier(id);
    return supplier;
};
