import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/customError';
import { checkTypeLiteral } from './utils/typeStringLiteral';
import { categories } from '../interface';

export const typeParamValidatorMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // const status = 'status';
            const category = 'category';
            const type = req.params.category;

            if (!Number.isNaN(Number(type))) {
                throw new CustomError(
                    'Bad request. Invalid param type. Type param must be string.',
                    400,
                );
            }

            checkTypeLiteral(categories, type, `${category[0].toUpperCase()}${category.slice(1)}`)

            

            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    };
};
