import { NextFunction, Request, RequestHandler, Response } from 'express';
import { CustomError } from '../errors/customError';

export const idParamValidatorMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const ids = req.params;
            if (!ids) {
                throw new CustomError(`Please provide correct params`, 400);
            }
            const badParams: string[] = [];

            for (const key of Object.keys(ids)) {
                if (Number.isNaN(Number(ids[key])) || Number(ids[key]) < 0) {
                    badParams.push(key);
                }
            }

            if (badParams.length > 0) {
                throw new CustomError(
                    `Bad request. Invalid params for ${[...badParams].join(
                        ', ',
                    )}. Id param(s) must be positive integer number.`,
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
