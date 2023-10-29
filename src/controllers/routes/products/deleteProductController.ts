import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, del, middleware } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { idParamValidatorMiddleware } from "../../../middlewares/idParamValidatorMiddleware";
import { ProductsStore } from "../../../models/productsStore";
import { tokenVerifyMiddleware } from "../../../middlewares/tokenVerifyMiddleware";

!controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DeleteProduct{
    @del(`${AppRoutePath.ENDPOINT_PRODUCTS}/:id`)
    @middleware(idParamValidatorMiddleware)
    @middleware(tokenVerifyMiddleware())
    async deleteProduct(req: Request, res: Response, next:NextFunction){
        try{
            const id = req.params.id
            const store = new ProductsStore()
            const deletedProduct = await store.deleteProductById(Number(id))
            if(!deletedProduct)
                throw new CustomError(`Product not found. Nothing to delete`, 404)
            res.status(204).send(deletedProduct)
        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`${err}`, 500))
        }
    }
}