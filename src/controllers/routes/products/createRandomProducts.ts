import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { radnomProducts } from '../../../randomItems';
import { ProductsStore } from '../../../models/productsStore';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateRandomProducts {
    @post(`${AppRoutePath.ENDPOINT_PRODUCTS}/create-random-products`)
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const store = new ProductsStore();

            const allProducts = await store.getAllProducts();

            if (allProducts.length !== 0) {
                throw new CustomError(
                    `${allProducts.length} products already exist in database.`,
                    409,
                );
            }

            for (const product of radnomProducts) {
                await store.createProduct(product);
            }

            res.status(201).send(
                `${radnomProducts.length} radnom products created.`,
            );
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
