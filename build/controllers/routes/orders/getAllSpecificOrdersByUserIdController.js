"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../decorators");
const customError_1 = require("../../../errors/customError");
const ordersStore_1 = require("../../../models/ordersStore");
const idParamValidatorMiddleware_1 = require("../../../middlewares/idParamValidatorMiddleware");
const queryValidatorMiddleware_1 = require("../../../middlewares/queryValidatorMiddleware");
let GetAllSpecificOrdersByUserIdController = 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class GetAllSpecificOrdersByUserIdController {
    getAllSpecificOrdersByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const status = req.query.status;
                const store = new ordersStore_1.OrdersStore();
                const allOrders = yield store.getOrderWithActiveStatusById(Number(userId), status);
                // if (allOrders.length === 0)
                //     throw new CustomError(
                //         `Orders list with status ${status} is empty.`,
                //         200,
                //     );
                res.status(200).send(allOrders);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError)
                    next(err);
                next(new customError_1.CustomError(`${err}`, 500));
            }
        });
    }
};
__decorate([
    (0, decorators_1.get)(`${"/users" /* AppRoutePath.ENDPOINT_USERS */}/:id${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status`),
    (0, decorators_1.middleware)((0, idParamValidatorMiddleware_1.idParamValidatorMiddleware)()),
    (0, decorators_1.middleware)((0, queryValidatorMiddleware_1.queryValidatorMiddleware)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], GetAllSpecificOrdersByUserIdController.prototype, "getAllSpecificOrdersByUserId", null);
GetAllSpecificOrdersByUserIdController = __decorate([
    (0, decorators_1.controller)("/api" /* AppRoutePath.PREFIX_ROUTE */)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
], GetAllSpecificOrdersByUserIdController);
