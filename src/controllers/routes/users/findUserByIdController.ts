import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { idParamValidatorMiddleware } from '../../../middlewares/idParamValidatorMiddleware';
import { UsersStore } from '../../../models/usersStore';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class FindUserById {
    @get(`${AppRoutePath.ENDPOINT_USERS}/:id`)
    @middleware(idParamValidatorMiddleware())
    @middleware(tokenVerifyMiddleware())
    async findUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const store = new UsersStore();
            const user = await store.showUserById(Number(id));

            if (!user)
                throw new CustomError(`User with id ${id} doesn't exist.`, 401);

            res.status(200).send(user);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 422));
        }
    }
}
