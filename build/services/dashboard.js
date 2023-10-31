"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
class Dashboard extends Storage {
    constructor() {
        super(...arguments);
        this.SQL_GET_ALL_ORDERS = 'SELECT * FROM orders_table';
        this.SQL_GET_ALL_PRODUCTS = 'SELECT * FROM products_table';
        this.SQL_INSERT_PRODUCT_IN_ORDERS = 'INSERT INTO product_id ';
    }
}
exports.Dashboard = Dashboard;
