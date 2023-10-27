import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/customError';

export const idParamValidatorMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as unknown as string;

            if (Number.isNaN(Number(id)) || Number(id) < 0) {
                throw new CustomError(
                    'Bad request. Invalid id. Id param must be positive integer number.',
                    400,
                );
            }

            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    };
};
