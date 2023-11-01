import client from '../database';
import { IProductsInOrders } from '../interface';
import { Store } from './utils/store';

export class ProductsInOrder extends Store {
    private readonly SQL_GET_ALL_PRODUCT_IN_ORDER =
        'SELECT * FROM products_in_orders_table';
    private readonly SQL_INSERT_PRODUCT_IN_ORDERS =
        'INSERT INTO products_in_orders_table (quantity, product_id, order_id) VALUES($1, $2, $3) RETURNING *';

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
}
