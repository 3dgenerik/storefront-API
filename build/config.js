"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_SESSION_SECRET_KEY = exports.SECRET_TOKEN = exports.SALT_ROUND = exports.POSTGRES_PASSWORD = exports.POSTGRES_DB_TEST = exports.POSTGRES_DB = exports.POSTGRES_USER = exports.POSTGRES_HOST = exports.ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.ENV = process.env.ENV;
exports.POSTGRES_HOST = process.env.PG_HOST;
exports.POSTGRES_USER = process.env.PG_USER;
exports.POSTGRES_DB = process.env.PG_DB;
exports.POSTGRES_DB_TEST = process.env.PG_DB_TEST;
exports.POSTGRES_PASSWORD = process.env.PG_PASSWORD;
exports.SALT_ROUND = process.env.SALT_ROUND;
exports.SECRET_TOKEN = process.env.SECRET_TOKEN;
exports.COOKIE_SESSION_SECRET_KEY = process.env.COOKIE_SESSION_SECRET_KEY;
