"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const errorHandlerMiddleware = (err, req, res, next) => {
    const error = err.formatMessage();
    res.status(error.statusCode).send(error.message);
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
