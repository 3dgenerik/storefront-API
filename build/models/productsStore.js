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
const randomItems_1 = require("../randomItems");
const store_1 = require("./utils/store");
class ProductsStore extends store_1.Store {
    constructor() {
        super();
        this.SQL_GET_ALL_PRODUCTS = 'SELECT * FROM products_table';
        this.SQL_IF_PRODUCT_EXIST = 'SELECT * FROM products_table WHERE name = ($1) AND category = ($2)';
        this.SQL_GET_PRODUCT_BY_ID = 'SELECT * FROM products_table WHERE id = ($1)';
        this.SQL_CREATE_PRODUCT = 'INSERT INTO products_table (id, name, price, category) VALUES(COALESCE((SELECT MAX(id) FROM products_table), 0) + 1, $1, $2, $3) RETURNING *';
        this.SQL_CREATE_PRODUCT_FOR_TEST = 'INSERT INTO products_table (id, name, price, category) VALUES($1, $2, $3, $4)';
        this.SQL_DELETE_PRODUCT = 'DELETE FROM products_table WHERE id = ($1) RETURNING *';
        this.SQL_DELETE_ALL_PRODUCTS = 'DELETE FROM products_table';
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
    createRandomProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const existingProducts = yield this.getAllProducts();
            if (existingProducts.length !== 0)
                return false;
            const conn = yield database_1.default.connect();
            for (const product of randomItems_1.radnomProducts) {
                const sql = this.SQL_CREATE_PRODUCT_FOR_TEST;
                yield conn.query(sql, [
                    product.id,
                    product.name,
                    product.price,
                    product.category,
                ]);
            }
            conn.release();
            return true;
        });
    }
    deleteAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteAllItems(this.SQL_DELETE_ALL_PRODUCTS);
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
