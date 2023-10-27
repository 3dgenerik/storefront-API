import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/customError';

export const errorHandlerMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const error = err.formatMessage();
    res.status(error.statusCode).send(error.message);
};
