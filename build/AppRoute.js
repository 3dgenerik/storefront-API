"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoute = void 0;
const express_1 = __importDefault(require("express"));
class AppRoute {
    static getInstance() {
        if (!AppRoute.instance) {
            AppRoute.instance = express_1.default.Router();
        }
        return AppRoute.instance;
    }
}
exports.AppRoute = AppRoute;
