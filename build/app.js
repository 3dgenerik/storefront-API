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
const cookie_session_1 = __importDefault(require("cookie-session"));
require("./controllers/routes/users/getAllUsersController");
require("./controllers/routes/users/createUserController");
require("./controllers/routes/users/findUserByIdController");
require("./controllers/routes/users/authUserController");
require("./controllers/routes/users/deleteUserController");
require("./controllers/routes/prdoducts/getAllProductsController");
// declare module 'express-serve-static-core' {
//     interface Request {
//         token?: IUser | null;
//     }
// }
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, cookie_session_1.default)({
    name: 'session',
    keys: [config_1.COOKIE_SESSION_SECRET_KEY],
    maxAge: 2 * 60 * 60 * 1000,
}));
app.use(AppRoute_1.AppRoute.getInstance());
app.use(errorHandlerMiddleware_1.errorHandlerMiddleware);
app.listen(config_1.PORT, () => {
    console.log(`...listening port ${config_1.PORT}`);
});
