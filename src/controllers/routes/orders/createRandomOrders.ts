import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { randomOrders } from '../../../randomItems';
import { OrdersStore } from '../../../models/ordersStore';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomOrders {
    @post(`${AppRoutePath.ENDPOINT_ORDERS}/create-random-orders`)
    async createRandomOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const store = new OrdersStore();

            const allOrders = await store.getAllOrders();

            if (allOrders.length !== 0) {
                throw new CustomError(
                    `${allOrders.length} orders already exist in database.`,
                    409,
                );
            }

            for (const order of randomOrders) {
                await store.createOrder(order);
            }

            res.status(201).send(
                `${randomOrders.length} radnom orders created.`,
            );
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
