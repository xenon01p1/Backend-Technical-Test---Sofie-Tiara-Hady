import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error.js';
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
}
export const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AppError(401, 'UNAUTHORIZED', 'Authentication token is required.');
        }
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new AppError(401, 'INVALID_TOKEN', 'Invalid authentication token.');
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }
        next(new AppError(401, 'INVALID_TOKEN', 'Invalid or expired authentication token.'));
    }
};
