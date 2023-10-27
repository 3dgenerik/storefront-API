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
const usersStore_1 = require("../../../models/usersStore");
const idParamValidatorMiddleware_1 = require("../../../middlewares/idParamValidatorMiddleware");
const tokenVerifyMiddleware_1 = require("../../../middlewares/tokenVerifyMiddleware");
let DeleteUserById = 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DeleteUserById {
    DeleteUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const store = new usersStore_1.UsersStore();
                const deletedUser = yield store.deleteUserById(Number(id));
                if (!deletedUser)
                    throw new customError_1.CustomError(`User not found. Nothing to delete`, 404);
                res.status(204).send(deletedUser);
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
    (0, decorators_1.del)(`${"/users" /* AppRoutePath.ENDPOINT_USERS */}/remove/:id`),
    (0, decorators_1.middleware)((0, idParamValidatorMiddleware_1.idParamValidatorMiddleware)())
    //TOKEN REQUIRED
    ,
    (0, decorators_1.middleware)((0, tokenVerifyMiddleware_1.tokenVerifyMiddleware)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], DeleteUserById.prototype, "DeleteUserById", null);
DeleteUserById = __decorate([
    (0, decorators_1.controller)("/api" /* AppRoutePath.PREFIX_ROUTE */)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
], DeleteUserById);
