"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyValidatorMiddleware = void 0;
const customError_1 = require("../errors/customError");
const isValueString_1 = require("../utils/isValueString");
const stringOrNumberThrowError = (key, body, isString) => {
    const keySplit = key.split('_');
    const keyValue = keySplit.length >= 2 ? keySplit.join(' ') : keySplit;
    const bodyValue = body[key];
    if (key === 'status') {
        if (bodyValue !== undefined &&
            bodyValue !== 'active' &&
            bodyValue !== 'complete') {
            throw new customError_1.CustomError(`Status must be 'active' or 'complete'.`, 401);
        }
    }
    if (bodyValue) {
        if (!(0, isValueString_1.isValueString)(bodyValue) && isString) {
            throw new customError_1.CustomError(`${keyValue} must be string. Please provide correct ${keyValue}`, 401);
        }
        else if ((0, isValueString_1.isValueString)(bodyValue) && !isString)
            throw new customError_1.CustomError(`${keyValue} must be number. Please provide correct ${keyValue}`, 401);
    }
    if (key === 'password') {
        const passwordLengthLimit = 4;
        const passwordLength = (bodyValue === null || bodyValue === void 0 ? void 0 : bodyValue.toString().length) || 0;
        if (passwordLength < passwordLengthLimit) {
            throw new customError_1.CustomError(`Password must contain minimum ${passwordLengthLimit} characters.`, 401);
        }
    }
};
const bodyValidatorMiddleware = (...keys) => {
    return (req, res, next) => {
        try {
            const body = req.body;
            const invalidKeys = [];
            for (const key of keys) {
                const bodyKey = body[key];
                if (!bodyKey) {
                    invalidKeys.push(key);
                }
            }
            if (invalidKeys.length > 0)
                throw new customError_1.CustomError(`Invalid values: ${[...invalidKeys].join(', ')}. Please provide correct values.`, 401);
            for (const key of keys) {
                switch (key) {
                    case 'first_name':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'last_name':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'password':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'name':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'price':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    case 'category':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'status':
                        stringOrNumberThrowError(key, body, true);
                        break;
                    case 'quantity':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    case 'product_id':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    case 'order_id':
                        stringOrNumberThrowError(key, body, false);
                        break;
                    default:
                }
            }
            next();
        }
        catch (err) {
            if (err instanceof customError_1.CustomError)
                next(err);
            next(new customError_1.CustomError(`${err}`, 422));
        }
    };
};
exports.bodyValidatorMiddleware = bodyValidatorMiddleware;
