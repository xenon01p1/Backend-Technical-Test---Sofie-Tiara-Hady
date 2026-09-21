import { AppError } from '../utils/app-error.js';
export const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            next(new AppError(401, 'UNAUTHORIZED', 'Authentication required.'));
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            next(new AppError(403, 'FORBIDDEN', 'Insufficient permissions.'));
            return;
        }
        next();
    };
};
