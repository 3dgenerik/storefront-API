import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { OrdersStore } from '../../../models/ordersStore';
import { idParamValidatorMiddleware } from '../../../middlewares/idParamValidatorMiddleware';
import { queryValidatorMiddleware } from '../../../middlewares/queryValidatorMiddleware';
import { TStatus } from '../../../interface';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetAllSpecificOrdersByUserIdController {
    @get(
        `${AppRoutePath.ENDPOINT_USERS}/:id${AppRoutePath.ENDPOINT_ORDERS}/status`,
    )
    @middleware(idParamValidatorMiddleware())
    @middleware(queryValidatorMiddleware())
    async getAllSpecificOrdersByUserId(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const userId = req.params.id;
            const status = req.query.status as TStatus;
            const store = new OrdersStore();
            const allOrders = await store.getAllSpecificStatusOrdersByUserId(
                Number(userId),
                status,
            );

            if (allOrders.length === 0)
                throw new CustomError(
                    `Orders list with status ${status} is empty.`,
                    200,
                );

            res.status(200).send(allOrders);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
