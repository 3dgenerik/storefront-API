"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryValidatorMiddleware = void 0;
const customError_1 = require("../errors/customError");
const typeStringLiteral_1 = require("./utils/typeStringLiteral");
const interface_1 = require("../interface");
const queryValidatorMiddleware = () => {
    return (req, res, next) => {
        try {
            const status = 'status';
            const type = req.query.status;
            if (!Number.isNaN(Number(type))) {
                throw new customError_1.CustomError('Bad request. Invalid query. Query param must be string.', 400);
            }
            (0, typeStringLiteral_1.checkTypeLiteral)(interface_1.statuses, type, `${status[0].toUpperCase()}${status.slice(1)}`);
            next();
        }
        catch (err) {
            if (err instanceof customError_1.CustomError)
                next(err);
            next(new customError_1.CustomError(`${err}`, 500));
        }
    };
};
exports.queryValidatorMiddleware = queryValidatorMiddleware;
