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
class UsersStore {
    passwordHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(password, Number(config_1.SALT_ROUND));
            return hash;
        });
    }
    passwordHashCompare(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const isMatch = yield bcrypt_1.default.compare(password, hash);
            return isMatch;
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = 'SELECT * FROM users_table';
            const result = yield conn.query(sql);
            conn.release();
            return result.rows;
        });
    }
    userExist(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.getAllUsers();
            for (const user of allUsers) {
                if (user.first_name === newUser.first_name &&
                    user.last_name === newUser.last_name) {
                    return true;
                }
            }
            return false;
        });
    }
    userExistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.getAllUsers();
            for (const user of allUsers) {
                if (user.id === id)
                    return true;
            }
            return false;
        });
    }
    showUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userExistById(id)))
                return null;
            const conn = yield database_1.default.connect();
            const sql = 'SELECT * FROM users_table WHERE id = ($1)';
            const result = yield conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.userExist(user)) {
                return null;
            }
            const conn = yield database_1.default.connect();
            const hash = yield this.passwordHash(user.password);
            const sql = 'INSERT INTO users_table (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *';
            const result = yield conn.query(sql, [
                user.first_name,
                user.last_name,
                hash,
            ]);
            conn.release();
            return result.rows[0];
        });
    }
    authUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.userExist(user)))
                return null;
            const conn = yield database_1.default.connect();
            const sql = 'SELECT * FROM users_table WHERE first_name = $1 AND last_name = $2';
            const result = yield conn.query(sql, [user.first_name, user.last_name]);
            conn.release();
            const dbUser = result.rows[0];
            if (!(yield this.passwordHashCompare(user.password, dbUser.password)))
                return null;
            return dbUser;
        });
    }
}
exports.UsersStore = UsersStore;
