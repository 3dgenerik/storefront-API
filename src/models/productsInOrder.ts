import client from '../database';
import { IProductsInOrders } from '../interface';
import { randomProductInOrder } from '../randomItems';
import { Store } from './utils/store';

export class ProductsInOrder extends Store {
    private readonly SQL_GET_ALL_PRODUCT_IN_ORDER =
        'SELECT * FROM products_in_orders_table';
    private readonly SQL_INSERT_PRODUCT_IN_ORDERS =
        'INSERT INTO products_in_orders_table (id, quantity, product_id, order_id) VALUES(COALESCE((SELECT MAX(id) FROM products_in_orders_table), 0) + 1, $1, $2, $3) RETURNING *';
    private readonly SQL_INSERT_PRODUCT_IN_ORDERS_FOR_TEST =
        'INSERT INTO products_in_orders_table (id, quantity, product_id, order_id) VALUES($1, $2, $3, $4)';
    private readonly SQL_DELETE_ALL_PRODUCT_IN_ORDERS =
        'DELETE FROM products_in_orders_table';

    constructor() {
        super();
    }

    async getAllProductInOrders(): Promise<IProductsInOrders[]> {
        return await this.getAllItems<IProductsInOrders>(
            this.SQL_GET_ALL_PRODUCT_IN_ORDER,
        );
    }

    async createProductsInOrders(
        productsInOrder: IProductsInOrders,
    ): Promise<IProductsInOrders> {
        const conn = await client.connect();
        const sql = this.SQL_INSERT_PRODUCT_IN_ORDERS;
        const result = await conn.query(sql, [
            productsInOrder.quantity,
            productsInOrder.product_id,
            productsInOrder.order_id,
        ]);
        conn.release();
        return result.rows[0];
    }

    async createRandomProductInOrders(): Promise<boolean> {
        const existingProductInOrders = await this.getAllProductInOrders();

        if (existingProductInOrders.length !== 0) return false;

        const conn = await client.connect();
        for (const productInOrder of randomProductInOrder) {
            const sql = this.SQL_INSERT_PRODUCT_IN_ORDERS_FOR_TEST;
            await conn.query(sql, [
                productInOrder.id,
                productInOrder.quantity,
                productInOrder.product_id,
                productInOrder.order_id,
            ]);
        }
        conn.release();

        return true;
    }

    async deleteAllProductInOrders(): Promise<void> {
        await this.deleteAllItems(this.SQL_DELETE_ALL_PRODUCT_IN_ORDERS);
    }
}
