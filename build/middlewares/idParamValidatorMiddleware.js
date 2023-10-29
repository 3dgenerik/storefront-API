"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamValidatorMiddleware = void 0;
const customError_1 = require("../errors/customError");
const idParamValidatorMiddleware = () => {
    return (req, res, next) => {
        try {
            const ids = req.params;
            if (!ids) {
                throw new customError_1.CustomError(`Please provide correct params`, 400);
            }
            const badParams = [];
            for (const key of Object.keys(ids)) {
                if (Number.isNaN(Number(ids[key])) || Number(ids[key]) < 0) {
                    badParams.push(key);
                }
            }
            if (badParams.length > 0) {
                throw new customError_1.CustomError(`Bad request. Invalid params for ${[...badParams].join(', ')}. Id param(s) must be positive integer number.`, 400);
            }
            next();
        }
        catch (err) {
            if (err instanceof customError_1.CustomError)
                next(err);
            next(new customError_1.CustomError(`${err}`, 500));
        }
    };
};
exports.idParamValidatorMiddleware = idParamValidatorMiddleware;
