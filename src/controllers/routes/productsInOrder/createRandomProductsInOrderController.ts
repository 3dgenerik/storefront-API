import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { randomProductInOrder } from '../../../randomItems';
import { ProductsInOrder } from '../../../models/productsInOrder';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomProductInOrders {
    @post(`/product-in-orders/create-random-product-in-orders`)
    async createRandomProductInOrders(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const store = new ProductsInOrder();

            const allProductInOrders = await store.getAllProductInOrders();

            if (allProductInOrders.length !== 0) {
                throw new CustomError(
                    `${allProductInOrders.length} product-in-orders already exist in database.`,
                    409,
                );
            }

            for (const productInOrder of randomProductInOrder) {
                await store.createProductsInOrders(productInOrder);
            }
            console.log(allProductInOrders);

            res.status(201).send(
                `${randomProductInOrder.length} random product-in-orders created.`,
            );
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
