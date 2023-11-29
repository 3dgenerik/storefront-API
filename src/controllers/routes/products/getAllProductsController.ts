import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get, middleware } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { ProductsStore } from '../../../models/productsStore';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetAllProductsController {
    @get(AppRoutePath.ENDPOINT_PRODUCTS)
    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const store = new ProductsStore();
            const allProducts = await store.getAllProducts();
            res.status(200).send(allProducts);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
