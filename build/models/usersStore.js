"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersStore = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
const store_1 = require("./utils/store");
class UsersStore extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_USERS = 'SELECT * FROM users_table';
        this.SQL_IF_USER_EXIST = 'SELECT * FROM users_table WHERE first_name = ($1) AND last_name = ($2)';
        this.SQL_GET_USER_BY_ID = 'SELECT * FROM users_table WHERE id = ($1)';
        this.SQL_CREATE_USER = 'INSERT INTO users_table (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
        this.SQL_AUTH_USER = 'SELECT * FROM users_table WHERE first_name = $1 AND last_name = $2';
        this.SQL_DELETE_USER = 'DELETE FROM users_table WHERE id = ($1) RETURNING *';
        //set sql query in parent class
        this.getAllItemsSqlQuery = this.SQL_GET_ALL_USERS;
        this.getItemByIdSqlQuery = this.SQL_GET_USER_BY_ID;
    }
    //create hash
    passwordHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, Number(config_1.SALT_ROUND));
            return hash;
        });
    }
    //compare password and hash
    passwordHashCompare(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMatch = yield bcrypt_1.default.compare(password, hash);
            return isMatch;
        });
    }
    //get all users - from parent class
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllItems();
        });
    }
    //if user exist
    userExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = this.SQL_IF_USER_EXIST;
            const result = yield conn.query(sql, [user.first_name, user.last_name]);
            conn.release();
            const existingUser = result.rows[0];
            if (existingUser)
                return true;
            return false;
        });
    }
    //show user by id - from parent class
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getItemById(id, this.SQL_GET_USER_BY_ID);
        });
    }
    //create user
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.userExist(user)) {
                return null;
            }
            const conn = yield database_1.default.connect();
            const hash = yield this.passwordHash(user.password);
            const sql = this.SQL_CREATE_USER;
            const result = yield conn.query(sql, [
                user.first_name,
                user.last_name,
                hash,
            ]);
            conn.release();
            return result.rows[0];
        });
    }
    //user authorization
    authUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userExist(user)))
                return null;
            const conn = yield database_1.default.connect();
            const sql = this.SQL_AUTH_USER;
            const result = yield conn.query(sql, [user.first_name, user.last_name]);
            conn.release();
            const dbUser = result.rows[0];
            if (!(yield this.passwordHashCompare(user.password, dbUser.password)))
                return null;
            return dbUser;
        });
    }
    //delete user - from parent class
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteItemById(id, this.SQL_DELETE_USER);
        });
    }
}
exports.UsersStore = UsersStore;
