"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    formatMessage() {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }
}
exports.CustomError = CustomError;
