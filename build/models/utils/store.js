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
            const conn = yield database_1.default.connect();
            const result = yield conn.query(sql);
            conn.release();
            return result.rows;
        });
    }
    itemExistById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = this.getItemByIdSqlQuery;
            const result = yield conn.query(sql, [id]);
            conn.release();
            const existingItem = result.rows[0];
            if (existingItem)
                return true;
            return false;
        });
    }
    itemById(id, sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.itemExistById(id)))
                return null;
            const conn = yield database_1.default.connect();
            const sql = sqlQuery;
            const result = yield conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        });
    }
    getItemById(id, sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.itemById(id, sqlQuery);
        });
    }
    deleteItemById(id, sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.itemById(id, sqlQuery);
        });
    }
    deleteAllItems(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            yield conn.query(sql);
            conn.release();
        });
    }
}
exports.Store = Store;
