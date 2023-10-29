"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTypeLiteral = void 0;
const customError_1 = require("../../errors/customError");
const checkTypeLiteral = (typeLiteral, maybeItemName, type) => {
    const items = typeLiteral.find((item) => {
        return item === maybeItemName;
    });
    if (items) {
        return items;
    }
    throw new customError_1.CustomError(`Bad request. ${type} must be ${[...typeLiteral].join(' | ')}.`, 400);
};
exports.checkTypeLiteral = checkTypeLiteral;
