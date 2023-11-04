import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { UsersStore } from '../../../models/usersStore';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomUsers {
    @post(`${AppRoutePath.ENDPOINT_USERS}/create-random-users`)
    async createRandomUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const store = new UsersStore();

            const existingUser = await store.createRandomUsers();

            if (!existingUser) {
                throw new CustomError(`Users already exist in database.`, 409);
            }

            res.status(201).send(`Random users created.`);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
