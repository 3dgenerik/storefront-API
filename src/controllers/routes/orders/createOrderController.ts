import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, middleware, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { IOrders } from '../../../interface';
import { bodyValidatorMiddleware } from '../../../middlewares/bodyValidatorMiddleware';
import { OrdersStore } from '../../../models/ordersStore';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateOrder {
    @post(`${AppRoutePath.ENDPOINT_ORDERS}/create`)
    @middleware(bodyValidatorMiddleware('user_id', 'status'))
    @middleware(tokenVerifyMiddleware())
    async createUser(req: Request, res: Response, next: NextFunction) {
        const order = req.body as IOrders;
        try {
            const store = new OrdersStore();
            const addedOrder = await store.createOrder(order);

            res.status(200).send(addedOrder);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
