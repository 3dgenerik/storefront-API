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
exports.ProductsInOrder = void 0;
const database_1 = __importDefault(require("../database"));
const randomItems_1 = require("../randomItems");
const store_1 = require("./utils/store");
class ProductsInOrder extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_PRODUCT_IN_ORDER = 'SELECT * FROM products_in_orders_table';
        this.SQL_INSERT_PRODUCT_IN_ORDERS = 'INSERT INTO products_in_orders_table (id, quantity, product_id, order_id) VALUES(COALESCE((SELECT MAX(id) FROM products_in_orders_table), 0) + 1, $1, $2, $3) RETURNING *';
        this.SQL_INSERT_PRODUCT_IN_ORDERS_FOR_TEST = 'INSERT INTO products_in_orders_table (id, quantity, product_id, order_id) VALUES($1, $2, $3, $4)';
        this.SQL_DELETE_ALL_PRODUCT_IN_ORDERS = 'DELETE FROM products_in_orders_table';
    }
    getAllProductInOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getAllItems(this.SQL_GET_ALL_PRODUCT_IN_ORDER);
            }
            catch (err) {
                throw new Error(`Cannot get all products-in-order: ${err}`);
            }
        });
    }
    createProductsInOrders(productsInOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield database_1.default.connect();
                const sql = this.SQL_INSERT_PRODUCT_IN_ORDERS;
                const result = yield conn.query(sql, [
                    productsInOrder.quantity,
                    productsInOrder.product_id,
                    productsInOrder.order_id,
                ]);
                conn.release();
                return result.rows[0];
            }
            catch (err) {
                throw new Error(`Cannot create products-in-order: ${err}`);
            }
        });
    }
    createRandomProductInOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProductInOrders = yield this.getAllProductInOrders();
                if (existingProductInOrders.length !== 0)
                    return false;
                const conn = yield database_1.default.connect();
                for (const productInOrder of randomItems_1.randomProductInOrder) {
                    const sql = this.SQL_INSERT_PRODUCT_IN_ORDERS_FOR_TEST;
                    yield conn.query(sql, [
                        productInOrder.id,
                        productInOrder.quantity,
                        productInOrder.product_id,
                        productInOrder.order_id,
                    ]);
                }
                conn.release();
                return true;
            }
            catch (err) {
                throw new Error(`Cannot create random products-in-order: ${err}`);
            }
        });
    }
    deleteAllProductInOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.deleteAllItems(this.SQL_DELETE_ALL_PRODUCT_IN_ORDERS);
            }
            catch (err) {
                throw new Error(`Cannot delete all products-in-order: ${err}`);
            }
        });
    }
}
exports.ProductsInOrder = ProductsInOrder;
