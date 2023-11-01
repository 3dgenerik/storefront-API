import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { UsersStore } from '../../../models/usersStore';
import { randomUsers } from '../../../randomItems';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomUsers {
    @post(`${AppRoutePath.ENDPOINT_USERS}/create-random-users`)
    async createRandomUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const store = new UsersStore();

            const allUsers = await store.getAllUsers();

            if (allUsers.length !== 0) {
                throw new CustomError(
                    `${allUsers.length} users already exist in database.`,
                    409,
                );
            }

            for (const user of randomUsers) {
                await store.createUser(user);
            }
            res.status(201).send(`${randomUsers.length} random users created.`);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
