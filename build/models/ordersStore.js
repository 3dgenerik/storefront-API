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
const randomItems_1 = require("../randomItems");
const store_1 = require("./utils/store");
class OrdersStore extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_ORDERS = 'SELECT * FROM orders_table';
        this.SQL_GET_ALL_ORDFERS_BY_USER_ID = 'SELECT * FROM orders_table WHERE user_id = ($1)';
        this.SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID = 'SELECT * FROM orders_table WHERE user_id = ($1) AND status = ($2)';
        this.SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS = `SELECT * FROM orders_table WHERE user_id = ($1) AND status = 'active'`;
        this.SQL_DELETE_ORDER_BY_USER_ID = 'DELETE FROM orders_table WHERE user_id = ($1) RETURNING *';
        this.SQL_UPDATE_ORDER_STATUS = 'UPDATE orders_table SET status = ($1) WHERE user_id = ($2) AND id = ($3) RETURNING *';
        this.SQL_CREATE_ORDER = 'INSERT INTO orders_table (id, user_id, status) VALUES(COALESCE((SELECT MAX(id) FROM orders_table), 0) + 1, $1, $2) RETURNING *';
        this.SQL_CREATE_ORDER_FOR_TEST = 'INSERT INTO orders_table (id, user_id, status) VALUES($1, $2, $3)';
        this.SQL_DELETE_ALL_ORDERS = 'DELETE FROM orders_table';
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getAllItems(this.SQL_GET_ALL_ORDERS);
            }
            catch (err) {
                throw new Error(`Cannot get all orders: ${err}`);
            }
        });
    }
    getAllOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_GET_ALL_ORDFERS_BY_USER_ID;
                const result = yield conn.query(sql, [userId]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get all orders by id: ${err}`);
            }
        });
    }
    getAllSpecificStatusOrdersByUserId(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID;
                const result = yield conn.query(sql, [userId, status]);
                conn.release();
                return result.rows;
            }
            catch (err) {
                throw new Error(`Cannot get orders: ${err}`);
            }
        });
    }
    getCurrentOrder(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS;
                const result = yield conn.query(sql, [userId]);
                conn.release();
                const orders = result.rows;
                if (orders.length === 0)
                    return null;
                const currentOrder = orders.reduce((latest, current) => (current.timestamp !== undefined && current.timestamp) >
                    (latest.timestamp !== undefined && latest.timestamp)
                    ? current
                    : latest, orders[0]);
                return currentOrder;
            }
            catch (err) {
                throw new Error(`Cannot get current order: ${err}`);
            }
        });
    }
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_CREATE_ORDER;
                const result = yield conn.query(sql, [
                    order.user_id,
                    order.status,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot create order: ${err}`);
            }
        });
    }
    createRandomOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingOrders = yield this.getAllOrders();
                if (existingOrders.length !== 0)
                    return false;
                const conn = yield database_1.default.connect();
                for (const order of randomItems_1.randomOrders) {
                    const sql = this.SQL_CREATE_ORDER_FOR_TEST;
                    yield conn.query(sql, [
                        order.id,
                        order.user_id,
                        order.status,
                    ]);
                }
                conn.release();
                return true;
            }
            catch (err) {
                throw new Error(`Cannot create random orders: ${err}`);
            }
        });
    }
    deleteAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.deleteAllItems(this.SQL_DELETE_ALL_ORDERS);
            }
            catch (err) {
                throw new Error(`Cannot delete orders: ${err}`);
            }
        });
    }
    completeOrder(userId, orderId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_UPDATE_ORDER_STATUS;
                const result = yield conn.query(sql, [status, userId, orderId]);
                conn.release();
                const completedOrder = result.rows[0];
                if (!completedOrder)
                    return null;
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot complete orders: ${err}`);
            }
        });
    }
}
exports.OrdersStore = OrdersStore;
