"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.put = exports.post = exports.get = exports.routerWrapper = void 0;
require("reflect-metadata");
const routerWrapper = (method) => {
    return (path) => {
        return (target, key) => {
            Reflect.defineMetadata("path" /* AppFeatures.PATH */, path, target, key);
            Reflect.defineMetadata("method" /* AppFeatures.METHOD */, method, target, key);
        };
    };
};
exports.routerWrapper = routerWrapper;
exports.get = (0, exports.routerWrapper)("get" /* AppMethods.GET */);
exports.post = (0, exports.routerWrapper)("post" /* AppMethods.POST */);
exports.put = (0, exports.routerWrapper)("put" /* AppMethods.PUT */);
exports.del = (0, exports.routerWrapper)("delete" /* AppMethods.DELETE */);
