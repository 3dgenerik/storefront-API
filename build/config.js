"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_TOKEN = exports.SALT_ROUND = exports.POSTGRES_PASSWORD = exports.POSTGRES_DB_TEST = exports.POSTGRES_DB = exports.POSTGRES_USER = exports.POSTGRES_HOST = exports.ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.ENV = process.env.ENV;
exports.POSTGRES_HOST = process.env.POSTGRES_HOST;
exports.POSTGRES_USER = process.env.POSTGRES_USER;
exports.POSTGRES_DB = process.env.POSTGRES_DB;
exports.POSTGRES_DB_TEST = process.env.POSTGRES_DB_TEST;
exports.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
exports.SALT_ROUND = process.env.SALT_ROUND;
exports.SECRET_TOKEN = process.env.SECRET_TOKEN;
