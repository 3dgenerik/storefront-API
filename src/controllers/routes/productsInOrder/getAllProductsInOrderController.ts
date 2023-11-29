import { NextFunction, Request, Response } from "express";
import { AppRoutePath } from "../../../constants";
import { controller, get } from "../../decorators";
import { CustomError } from "../../../errors/customError";
import { ProductsInOrder } from "../../../models/productsInOrder";

@controller(AppRoutePath.PREFIX_ROUTE)
class GetAllProductsInOrders{
    @get(AppRoutePath.ENDPOINT_PRODUCTS_IN_ORDERS)
    async getAllProductsInOrders(req: Request, res: Response, next: NextFunction){
        try{
            const store = new ProductsInOrder()
            const productsInOrders = await store.getAllProductInOrders()
            res.status(200).send(productsInOrders)
        }catch(err){
            if(err instanceof CustomError)
                next(err)
            next(new CustomError('Enable to get all products in orders', 422))
        }
    }
}