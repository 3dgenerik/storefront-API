import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, middleware, post } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { bodyValidatorMiddleware } from '../../../middlewares/bodyValidatorMiddleware';
import { IProduct } from '../../../interface';
import { ProductsStore } from '../../../models/productsStore';
import { tokenVerifyMiddleware } from '../../../middlewares/tokenVerifyMiddleware';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CreateProductController {
    @post(AppRoutePath.ENDPOINT_PRODUCTS)
    @middleware(bodyValidatorMiddleware('name', 'price', 'category'))
    @middleware(tokenVerifyMiddleware())
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = req.body as IProduct;
            const store = new ProductsStore();
            const addedProduct = await store.createProduct(product);
            if (!addedProduct)
                throw new CustomError(
                    `Product ${product.name} in category: ${product.category} already exist.`,
                    409,
                );
            // res.status(201).send(addedProduct);
            res.status(201).send('OK');
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
