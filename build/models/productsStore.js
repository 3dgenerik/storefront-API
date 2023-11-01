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
exports.ProductsStore = void 0;
const database_1 = __importDefault(require("../database"));
const store_1 = require("./utils/store");
class ProductsStore extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_PRODUCTS = 'SELECT * FROM products_table';
        this.SQL_IF_PRODUCT_EXIST = 'SELECT * FROM products_table WHERE name = ($1) AND category = ($2)';
        this.SQL_GET_PRODUCT_BY_ID = 'SELECT * FROM products_table WHERE id = ($1)';
        this.SQL_CREATE_PRODUCT = 'INSERT INTO products_table (name, price, category) VALUES($1, $2, $3) RETURNING *';
        this.SQL_DELETE_PRODUCT = 'DELETE FROM products_table WHERE id = ($1) RETURNING *';
        this.getItemByIdSqlQuery = this.SQL_GET_PRODUCT_BY_ID;
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllItems(this.SQL_GET_ALL_PRODUCTS);
        });
    }
    productExist(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = this.SQL_IF_PRODUCT_EXIST;
            const result = yield conn.query(sql, [product.name, product.category]);
            conn.release();
            const existingProduct = result.rows[0];
            if (existingProduct)
                return true;
            return false;
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getItemById(id, this.SQL_GET_PRODUCT_BY_ID);
        });
    }
    createProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.productExist(product)) {
                return null;
            }
            const conn = yield database_1.default.connect();
            const sql = this.SQL_CREATE_PRODUCT;
            const result = yield conn.query(sql, [
                product.name,
                product.price,
                product.category,
            ]);
            conn.release();
            return result.rows[0];
        });
    }
    deleteProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteItemById(id, this.SQL_DELETE_PRODUCT);
        });
    }
    getProductsByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield database_1.default.connect();
            const sql = 'SELECT * FROM products_table WHERE category = ($1)';
            const result = yield conn.query(sql, [category]);
            conn.release();
            return result.rows;
        });
    }
}
exports.ProductsStore = ProductsStore;
