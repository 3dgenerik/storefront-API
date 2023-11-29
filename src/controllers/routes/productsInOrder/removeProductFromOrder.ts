import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, del, middleware } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { idParamValidatorMiddleware } from "../../../middlewares/idParamValidatorMiddleware";
import { ProductsInOrder } from "../../../models/productsInOrder";
import { tokenVerifyMiddleware } from "../../../middlewares/tokenVerifyMiddleware";

@controller(AppRoutePath.PREFIX_ROUTE)
class RemoveProductFromOrder{
    @del(`${AppRoutePath.ENDPOINT_ORDERS}/:orderId${AppRoutePath.ENDPOINT_PRODUCTS}/:productId`)
    @middleware(idParamValidatorMiddleware())
    // @middleware(tokenVerifyMiddleware())
    async removeProductFromOrder(req: Request, res: Response, next: NextFunction){
        try{
            const orderId = req.params.orderId;
            const productId = req.params.productId;

            const store = new ProductsInOrder()
            const deletedProduct = await store.removeProductFromOrder(Number(orderId), Number(productId))

            if(!deletedProduct)
                throw new CustomError(`Product with id ${productId} doesn't exist in order with id ${orderId}`, 404)

            res.status(200).send(deletedProduct)
        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`Enable to delete product.`, 422))
        }
    }
}