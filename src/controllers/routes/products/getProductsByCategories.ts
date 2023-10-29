import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, get, middleware } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { typeParamValidatorMiddleware } from "../../../middlewares/typeParamValidatorMiddleware";
import { ProductsStore } from "../../../models/productsStore";
import { TCategory } from "../../../interface";

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetProductsByCategories{
    @get(`${AppRoutePath.ENDPOINT_PRODUCTS}/category/:category`)
    @middleware(typeParamValidatorMiddleware())
    async getProductByCategories(req: Request, res: Response, next:NextFunction){
        try{
            const category = req.params.category as TCategory;
            const store = new ProductsStore()
            const products = await store.getProductsByCategory(category)

            if(products.length === 0)
                throw new CustomError('Products not found.', 404)
            res.send(products)
        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`${err}`, 500))
        }

    }
}