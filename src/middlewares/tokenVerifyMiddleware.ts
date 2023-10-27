import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config';
import { CustomError } from '../errors/customError';
import { IToken } from '../interface';

export const tokenVerifyMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorization = req.headers.authorization;
            const token = authorization?.split(' ')[1] || '';
            const decoded = jwt.verify(token, SECRET_TOKEN) as IToken;

            if (!decoded) {
                throw new CustomError(
                    `Invalid token. Please sign in, or sign up again.`,
                    401,
                );
            }

            if (req.session) {
                req.session.userFromToken = decoded.user;
            }

            next();
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`Invalid token. ${err}`, 500));
        }
    };
};
