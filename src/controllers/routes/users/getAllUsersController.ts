import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { CustomError } from '../../../errors/customError';
import { UsersStore } from '../../../models/usersStore';
import { get, controller, middleware } from '../../decorators';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetAllUsers {
    @get(AppRoutePath.ENDPOINT_USERS)
    //TOKEN REQUIRED
    @middleware(tokenVerifyMiddleware())
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log('SESSION TOKEN: ', req.session?.userFromToken);
            const store = new UsersStore();
            const users = await store.getAllUsers();
            res.status(200).send(users);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
