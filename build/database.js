"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("./config");
let client = new pg_1.Pool({});
if (config_1.ENV === 'dev') {
    client = new pg_1.Pool({
        host: config_1.POSTGRES_HOST,
        user: config_1.POSTGRES_USER,
        database: config_1.POSTGRES_DB,
        password: config_1.POSTGRES_PASSWORD,
    });
}
if (config_1.ENV === 'test') {
    client = new pg_1.Pool({
        host: config_1.POSTGRES_HOST,
        user: config_1.POSTGRES_USER,
        database: config_1.POSTGRES_DB_TEST,
        password: config_1.POSTGRES_PASSWORD,
    });
}
exports.default = client;
