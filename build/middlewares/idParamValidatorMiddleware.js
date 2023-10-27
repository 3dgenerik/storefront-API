"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamValidatorMiddleware = void 0;
const customError_1 = require("../errors/customError");
const idParamValidatorMiddleware = () => {
    return (req, res, next) => {
        try {
            const id = req.params.id;
            if (Number.isNaN(Number(id)) || Number(id) < 0) {
                throw new customError_1.CustomError('Id param must be positive integer number.', 401);
            }
            next();
        }
        catch (err) {
            if (err instanceof customError_1.CustomError)
                next(err);
            next(new customError_1.CustomError(`${err}`, 401));
        }
    };
};
exports.idParamValidatorMiddleware = idParamValidatorMiddleware;
