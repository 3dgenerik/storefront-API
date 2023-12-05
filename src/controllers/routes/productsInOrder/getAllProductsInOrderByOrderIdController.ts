import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, get, middleware } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { ProductsInOrder } from "../../../models/productsInOrder";
import { idParamValidatorMiddleware } from "../../../middlewares/idParamValidatorMiddleware";

@controller(AppRoutePath.PREFIX_ROUTE)
class GetAllProductsInOrderByOrderIdController{
    @get(`${AppRoutePath.ENDPOINT_PRODUCTS_IN_ORDERS}/:orderId`)
    @middleware(idParamValidatorMiddleware())
    async getAllProductsInOrderByOrderId(req: Request, res: Response, next: NextFunction){
        try{
            const orderId = req.params.orderId;
            const store = new ProductsInOrder()
            const productsInOrderByOrderId = await store.getAllProductsInOrderByOrderId(Number(orderId))
            res.status(200).send(productsInOrderByOrderId)

        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`Something went wrong while getting products in orders by order ID`, 500))
        }
    }
}