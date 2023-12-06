import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, del, middleware } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { ProductsInOrder } from "../../../models/productsInOrder";
import { idParamValidatorMiddleware } from "../../../middlewares/idParamValidatorMiddleware";

@controller(AppRoutePath.PREFIX_ROUTE)
class DeleteAllProductInOrdersByOrderId{
    @del(`${AppRoutePath.ENDPOINT_PRODUCTS}${AppRoutePath.ENDPOINT_ORDERS}/:orderId`)
    @middleware(idParamValidatorMiddleware())
    async deleteAllProductInOrdersByOrderId(req: Request, res: Response, next: NextFunction){
        try{
            const orderId = req.params.orderId
            const store = new ProductsInOrder()
            const deletedProductsInOrder = await store.deleteAllProductsInOrderByOrderId(Number(orderId))

            if(deletedProductsInOrder.length===0)
                throw new CustomError(`Nothing to delete`, 404)

            res.status(200).send(deletedProductsInOrder)

        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`Something wrong by deleting products in order`, 500))
        }
    }

}