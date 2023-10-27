import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, middleware, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { bodyValidatorMiddleware } from '../../../middlewares/bodyValidatorMiddleware';
import { ICreatedUserOutput, IUser } from '../../../interface';
import { UsersStore } from '../../../models/usersStore';
import { SECRET_TOKEN } from '../../../config';
import jwt from 'jsonwebtoken';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class AuthUserController {
    @post(`${AppRoutePath.ENDPOINT_USERS}/signin`)
    @middleware(bodyValidatorMiddleware('first_name', 'last_name', 'password'))
    async authUserController(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.body as IUser;
            const store = new UsersStore();
            const authUser = await store.authUser(user);

            if (!authUser)
                throw new CustomError(
                    `User doesn't exist. Please provide correct first name, last name and password`,
                    401,
                );

            const token = jwt.sign({ user: authUser }, SECRET_TOKEN);

            const outputMessage: ICreatedUserOutput = {
                output: {
                    user: authUser,
                    token,
                },
            };

            res.send(outputMessage);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 422));
        }
    }
}
