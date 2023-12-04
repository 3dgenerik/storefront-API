import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { ProductsStore } from '../../../models/productsStore';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomProducts {
    @post(`${AppRoutePath.ENDPOINT_PRODUCTS}/create-random-products`)
    async createRandomProducts(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const store = new ProductsStore();

            const allProducts = await store.createRandomProducts();

            if (!allProducts) {
                throw new CustomError(
                    `Products already exist in database.`,
                    409,
                );
            }

            res.send(`Random products created.`);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
