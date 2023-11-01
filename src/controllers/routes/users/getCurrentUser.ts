import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';
import { IUser } from '../../../interface';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetCurrentUser {
    @get(`${AppRoutePath.ENDPOINT_USERS}/current`)
    @middleware(tokenVerifyMiddleware())
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const currentUser = req.session?.userFromToken as IUser;
            res.status(200).send(currentUser);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
