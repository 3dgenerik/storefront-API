import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, middleware, put } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { idParamValidatorMiddleware } from "../../../middlewares/idParamValidatorMiddleware";
import { OrdersStore } from "../../../models/ordersStore";

@controller(AppRoutePath.PREFIX_ROUTE)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class CompleteOrderController{
    @put(`${AppRoutePath.ENDPOINT_USERS}/:userId${AppRoutePath.ENDPOINT_ORDERS}/:orderId`)
    @middleware(idParamValidatorMiddleware())
    async completeOrder(req: Request, res: Response, next: NextFunction){
        try{
            const userId = req.params.userId
            const orderId = req.params.orderId

            const store = new OrdersStore()
            const order = await store.completeOrder(Number(userId), Number(orderId))

            if(!order)
                throw new CustomError(`Bad request. User or order doesn't exist. Can't complete order.`, 404)

            res.status(200).send(order)
        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError(`${err}`, 500))
        }
    }
}