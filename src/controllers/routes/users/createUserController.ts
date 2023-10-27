import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, middleware, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { UsersStore } from '../../../models/usersStore';
import { IUser } from '../../../interface';
import { bodyValidatorMiddleware } from '../../../middlewares/bodyValidatorMiddleware';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../../../config';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
class CreateUser {
    @post(`${AppRoutePath.ENDPOINT_USERS}/create`)
    @middleware(bodyValidatorMiddleware('first_name', 'last_name', 'password'))
    async createUser(req: Request, res: Response, next: NextFunction) {
        const user = req.body as IUser;
        try {
            const store = new UsersStore();
            const addedUser = await store.createUser(user);
            if (!addedUser)
                throw new CustomError(
                    `User ${user.first_name} ${user.last_name} already exist.`,
                    401,
                );
            const token = jwt.sign({ user: addedUser }, SECRET_TOKEN);

            res.status(200).send(token);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 422));
        }
    }
}
