import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, del, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { UsersStore } from '../../../models/usersStore';
import { idParamValidatorMiddleware } from '../../../middlewares/idParamValidatorMiddleware';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DeleteUserById {
    @del(`${AppRoutePath.ENDPOINT_USERS}/remove/:id`)
    @middleware(idParamValidatorMiddleware())
    @middleware(tokenVerifyMiddleware())
    async DeleteUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const store = new UsersStore();
            const deletedUser = await store.deleteUserById(Number(id));

            if (!deletedUser)
                throw new CustomError(`User not found. Nothing to delete`, 404);
            console.log(deletedUser);
            res.status(204).send(deletedUser);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
