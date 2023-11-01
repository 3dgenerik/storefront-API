import { NextFunction, Request, Response } from 'express';
import { AppRoutePath } from '../../../constants';
import { controller, get } from '../../decorators';
import { CustomError } from '../../../errors/customError';
import { DashboardQueries } from '../../../services/dashboard';

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetMostPopularProducts {
    @get(`${AppRoutePath.ENDPOINT_PRODUCTS}/popular`)
    async getMostPopularProducts(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const store = new DashboardQueries();
            const popularProducts = await store.mostPopularProducts();

            if (popularProducts.length === 0)
                throw new CustomError(`Popular list is empty`, 204);

            res.status(200).send(popularProducts);
        } catch (err) {
            if (err instanceof CustomError) next(err);
            next(new CustomError(`${err}`, 500));
        }
    }
}
