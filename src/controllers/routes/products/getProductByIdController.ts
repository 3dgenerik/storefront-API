import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, get, middleware } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { idParamValidatorMiddleware } from "../../../middlewares/idParamValidatorMiddleware";
import { ProductsStore } from "../../../models/productsStore";

@controller(AppRoutePath.PREFIX_ROUTE)
class GetProductById{
    @get(`${AppRoutePath.ENDPOINT_PRODUCTS}/:id`)
    @middleware(idParamValidatorMiddleware())
    async getProductById(req: Request, res: Response, next: NextFunction){
        try{
            const id = req.params.id;
            const store = new ProductsStore()
            const product = await store.getProductById(Number(id))

            if(!product)
                throw new CustomError(`Product with id ${id} not found.`, 404);
                res.status(200).send(product)

        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`Enable to get product.`, 422))
        }
    }
}