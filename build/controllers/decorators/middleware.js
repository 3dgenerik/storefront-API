"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
require("reflect-metadata");
const middleware = (middleware) => {
    return (target, key) => {
        const middlewares = Reflect.getMetadata("middleware" /* AppFeatures.MIDDLEWARE */, target, key) || [];
        Reflect.defineMetadata("middleware" /* AppFeatures.MIDDLEWARE */, [...middlewares, middleware], target, key);
    };
};
exports.middleware = middleware;
