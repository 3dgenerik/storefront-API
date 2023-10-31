import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { OrdersStore } from '../../../models/ordersStore';
import { idParamValidatorMiddleware } from '../../../middlewares/idParamValidatorMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetCurrentOrderController {
    @get(
        `${AppRoutePath.ENDPOINT_USERS}/:id${AppRoutePath.ENDPOINT_ORDERS}/current`
    )
    @middleware(idParamValidatorMiddleware())
    async getCurrentOrderController(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.params.id;
            const store = new OrdersStore();
            const order = await store.getCurrentOrder(Number(userId));

            if (!order) throw new CustomError(`Current order not found.`, 404);

            res.status(200).send(order);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
