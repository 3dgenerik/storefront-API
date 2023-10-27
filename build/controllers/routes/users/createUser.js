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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../../decorators");
const customError_1 = require("../../../errors/customError");
const usersStore_1 = require("../../../models/usersStore");
const bodyValidatorMiddleware_1 = require("../../../middlewares/bodyValidatorMiddleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../config");
let CreateUser = class CreateUser {
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            try {
                const store = new usersStore_1.UsersStore();
                const addedUser = yield store.createUser(user);
                if (!addedUser)
                    throw new customError_1.CustomError(`User ${user.first_name} ${user.last_name} already exist.`, 401);
                const token = jsonwebtoken_1.default.sign({ user: addedUser }, config_1.SECRET_TOKEN);
                res.status(200).send(token);
            }
            catch (err) {
                if (err instanceof customError_1.CustomError)
                    next(err);
                next(new customError_1.CustomError(`${err}`, 422));
            }
        });
    }
};
__decorate([
    (0, decorators_1.post)(`${"/users" /* AppRoutePath.ENDPOINT_USERS */}/create`),
    (0, decorators_1.middleware)((0, bodyValidatorMiddleware_1.bodyValidatorMiddleware)('first_name', 'last_name', 'password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], CreateUser.prototype, "createUser", null);
CreateUser = __decorate([
    (0, decorators_1.controller)("/api" /* AppRoutePath.PREFIX_ROUTE */)
], CreateUser);
