import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { OrdersStore } from '../../../models/ordersStore';
import { idParamValidatorMiddleware } from '../../../middlewares/idParamValidatorMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetAllOrdersByUserIdController {
    @get(
        `${AppRoutePath.ENDPOINT_USERS}/:userId${AppRoutePath.ENDPOINT_ORDERS}`,
    )
    @middleware(idParamValidatorMiddleware())
    async getAllOrdersByUserId(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.params.userId;
            const store = new OrdersStore();
            const allOrders = await store.getAllOrdersByUserId(Number(userId));

            if (allOrders.length === 0)
                throw new CustomError(`Orders list is empty.`, 200);

            res.status(200).send(allOrders);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
