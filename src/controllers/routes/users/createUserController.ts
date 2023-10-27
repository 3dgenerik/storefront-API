import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, middleware, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { UsersStore } from '../../../models/usersStore';
import { ICreatedUserOutput, IUser } from '../../../interface';
import { bodyValidatorMiddleware } from '../../../middlewares/bodyValidatorMiddleware';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../../../config';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateUser {
    @post(`${AppRoutePath.ENDPOINT_USERS}/signup`)
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

            const outputMessage: ICreatedUserOutput = {
                output: {
                    user: addedUser,
                    token,
                },
            };

            res.status(200).send(outputMessage);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 422));
        }
    }
}
