import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
export const errorMiddleware = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
        const issue = error.issues[0];
        res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: `value ${issue.path.join('.')} is missing`,
            },
        });
        return;
    }
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            error: {
                code: error.code,
                message: error.message,
            },
        });
        return;
    }
    console.error(error);
    res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
        },
    });
};
