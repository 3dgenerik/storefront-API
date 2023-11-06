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
exports.Store = void 0;
const database_1 = __importDefault(require("../../database"));
class Store {
    constructor() {
        this.getItemByIdSqlQuery = '';
    }
    getAllItems(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const result = yield conn.query(sql);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get all items: ${err}`);
            }
        });
    }
    itemExistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.getItemByIdSqlQuery;
                const result = yield conn.query(sql, [id]);
                conn.release();
                const existingItem = result.rows[0];
                if (existingItem)
                    return true;
                return false;
            }
            catch (err) {
                throw new Error(`Cannot get item: ${err}`);
            }
        });
    }
    itemById(id, sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(yield this.itemExistById(id)))
                    return null;
                const conn = yield database_1.default.connect();
                const sql = sqlQuery;
                const result = yield conn.query(sql, [id]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot get item: ${err}`);
            }
        });
    }
    getItemById(id, sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.itemById(id, sqlQuery);
            }
            catch (err) {
                throw new Error(`Cannot get item: ${err}`);
            }
        });
    }
    deleteItemById(id, sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.itemById(id, sqlQuery);
            }
            catch (err) {
                throw new Error(`Cannot delete item: ${err}`);
            }
        });
    }
    deleteAllItems(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                yield conn.query(sql);
                conn.release();
            }
            catch (err) {
                throw new Error(`Cannot delete items ${err}`);
            }
        });
    }
}
exports.Store = Store;
