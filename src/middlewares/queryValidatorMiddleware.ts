import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/customError';
import { checkTypeLiteral } from './utils/typeStringLiteral';
import { statuses } from '../interface';

export const queryValidatorMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const status = 'status';
            const type = req.query.status as string;

            if (!Number.isNaN(Number(type))) {
                throw new CustomError(
                    'Bad request. Invalid query. Query param must be string.',
                    400,
                );
            }

            checkTypeLiteral(
                statuses,
                type,
                `${status[0].toUpperCase()}${status.slice(1)}`,
            );

            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    };
};
