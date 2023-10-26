"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const AppRoute_1 = require("./AppRoute");
const config_1 = require("./config");
const errorHandlerMiddleware_1 = require("./middlewares/errorHandlerMiddleware");
require("./controllers/routes/users/getAllUsers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(AppRoute_1.AppRoute.getInstance());
app.use(errorHandlerMiddleware_1.errorHandlerMiddleware);
app.listen(config_1.PORT, () => {
    console.log(`...listening port ${config_1.PORT}`);
});
