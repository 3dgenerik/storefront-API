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
exports.OrdersStore = void 0;
const database_1 = __importDefault(require("../database"));
const store_1 = require("./utils/store");
class OrdersStore extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_ORDERS = 'SELECT * FROM orders_table';
        this.SQL_GET_ALL_ORDFERS_BY_USER_ID = 'SELECT * FROM orders_table WHERE user_id = ($1)';
        this.SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID = 'SELECT * FROM orders_table WHERE user_id = ($1) AND status = ($2)';
        this.SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS = `SELECT * FROM orders_table WHERE user_id = ($1) AND status = 'active'`;
        this.getAllItemsSqlQuery = this.SQL_GET_ALL_ORDERS;
    }
    getAllOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = this.SQL_GET_ALL_ORDFERS_BY_USER_ID;
            const result = yield conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        });
    }
    getAllSpecificStatusOrdersByUserId(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = this.SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID;
            const result = yield conn.query(sql, [userId, status]);
            conn.release();
            return result.rows;
        });
    }
    getCurrentOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = this.SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS;
            const result = yield conn.query(sql, [userId]);
            conn.release();
            const orders = result.rows;
            if (orders.length === 0)
                return null;
            const currentOrder = orders.reduce((latest, current) => current.timestamp > latest.timestamp ? current : latest, orders[0]);
            return currentOrder;
        });
    }
}
exports.OrdersStore = OrdersStore;
