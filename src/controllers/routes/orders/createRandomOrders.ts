import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { OrdersStore } from '../../../models/ordersStore';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomOrders {
    @post(`${AppRoutePath.ENDPOINT_ORDERS}/create-random-orders`)
    async createRandomOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const store = new OrdersStore();

            const allOrders = await store.createRandomOrders();

            if (!allOrders) {
                throw new CustomError(`Orders already exist in database.`, 409);
            }

            res.status(201).send(`Random orders created.`);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
