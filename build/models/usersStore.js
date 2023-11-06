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
const randomItems_1 = require("../randomItems");
class UsersStore extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_USERS = 'SELECT * FROM users_table';
        this.SQL_IF_USER_EXIST = 'SELECT * FROM users_table WHERE first_name = ($1) AND last_name = ($2)';
        this.SQL_GET_USER_BY_ID = 'SELECT * FROM users_table WHERE id = ($1)';
        this.SQL_CREATE_USER = 'INSERT INTO users_table (id, first_name, last_name, password) VALUES(COALESCE((SELECT MAX(id) FROM users_table), 0) + 1, $1, $2, $3) RETURNING *';
        this.SQL_CREATE_USER_FOR_TEST = 'INSERT INTO users_table (id, first_name, last_name, password) VALUES($1, $2, $3, $4)';
        this.SQL_AUTH_USER = 'SELECT * FROM users_table WHERE first_name = $1 AND last_name = $2';
        this.SQL_DELETE_ALL_USERS = 'DELETE FROM users_table';
        //set sql query in parent class
        this.getItemByIdSqlQuery = this.SQL_GET_USER_BY_ID;
    }
    //create hash
    passwordHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash = yield bcrypt_1.default.hash(password, Number(config_1.SALT_ROUND));
                return hash;
            }
            catch (err) {
                throw new Error(`Cannot hash password: ${err}`);
            }
        });
    }
    //compare password and hash
    passwordHashCompare(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isMatch = yield bcrypt_1.default.compare(password, hash);
                return isMatch;
            }
            catch (err) {
                throw new Error(`Cannot compare hash and password: ${err}`);
            }
        });
    }
    //get all users - from parent class
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getAllItems(this.SQL_GET_ALL_USERS);
            }
            catch (err) {
                throw new Error(`Cannot get all users: ${err}`);
            }
        });
    }
    //if user exist
    userExist(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_IF_USER_EXIST;
                const result = yield conn.query(sql, [user.first_name, user.last_name]);
                conn.release();
                const existingUser = result.rows[0];
                if (existingUser)
                    return true;
                return false;
            }
            catch (err) {
                throw new Error(`Cannot perform action for user exist: ${err}`);
            }
        });
    }
    //show user by id - from parent class
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getItemById(id, this.SQL_GET_USER_BY_ID);
            }
            catch (err) {
                throw new Error(`Cannot get user: ${err}`);
            }
        });
    }
    //create user
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (err) {
                throw new Error(`Cannot create user: ${err}`);
            }
        });
    }
    //create users list
    createRandomUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUsers = yield this.getAllUsers();
                if (existingUsers.length !== 0)
                    return false;
                const conn = yield database_1.default.connect();
                for (const user of randomItems_1.randomUsers) {
                    const hash = yield this.passwordHash(user.password);
                    const sql = this.SQL_CREATE_USER_FOR_TEST;
                    yield conn.query(sql, [
                        user.id,
                        user.first_name,
                        user.last_name,
                        hash,
                    ]);
                }
                conn.release();
                return true;
            }
            catch (err) {
                throw new Error(`Cannot create random users: ${err}`);
            }
        });
    }
    deleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.deleteAllItems(this.SQL_DELETE_ALL_USERS);
            }
            catch (err) {
                throw new Error(`Cannot delete all users: ${err}`);
            }
        });
    }
    //user authorization
    authUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (err) {
                throw new Error(`Cannot auth user: ${err}`);
            }
        });
    }
}
exports.UsersStore = UsersStore;
