"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValueString = void 0;
const isValueString = (value) => {
    if (Number.isNaN(Number(value))) {
        return true;
    }
    return false;
};
exports.isValueString = isValueString;
