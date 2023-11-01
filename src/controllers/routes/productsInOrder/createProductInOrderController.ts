import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, middleware, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { bodyValidatorMiddleware } from '../../../middlewares/bodyValidatorMiddleware';
import { ProductsInOrder } from '../../../models/productsInOrder';
import { IProductsInOrders } from '../../../interface';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateProductInOrder {
    @post(
        `${AppRoutePath.ENDPOINT_ORDERS}${AppRoutePath.ENDPOINT_PRODUCTS}/create`,
    )
    @middleware(bodyValidatorMiddleware('quantity', 'product_id', 'order_id'))
    @middleware(tokenVerifyMiddleware())
    async createProductInOrder(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const productInOrder = req.body as IProductsInOrders;
            const store = new ProductsInOrder();
            const createdProductInOrder =
                await store.createProductsInOrders(productInOrder);
            res.status(200).send(createdProductInOrder);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(
                new CustomError(
                    `Enable to create product in orders. Please use unique product ids for orders.`,
                    422,
                ),
            );
        }
    }
}
