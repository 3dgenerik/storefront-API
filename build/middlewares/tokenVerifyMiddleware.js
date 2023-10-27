"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerifyMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const customError_1 = require("../errors/customError");
const tokenVerifyMiddleware = () => {
    return (req, res, next) => {
        try {
            const authorization = req.headers.authorization;
            const token = (authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1]) || '';
            const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_TOKEN);
            if (!decoded) {
                throw new customError_1.CustomError(`Invalid token. Please sign in, or sign up again.`, 401);
            }
            if (req.session) {
                req.session.userFromToken = decoded.user;
            }
            next();
        }
        catch (err) {
            if (err instanceof customError_1.CustomError)
                next(err);
            next(new customError_1.CustomError(`Invalid token. ${err}`, 500));
        }
    };
};
exports.tokenVerifyMiddleware = tokenVerifyMiddleware;
