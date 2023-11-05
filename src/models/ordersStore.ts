import client from '../database';
import { IOrders, TStatus } from '../interface';
import { randomOrders } from '../randomItems';
import { Store } from './utils/store';

export class OrdersStore extends Store {
    private readonly SQL_GET_ALL_ORDERS = 'SELECT * FROM orders_table';
    private readonly SQL_GET_ALL_ORDFERS_BY_USER_ID =
        'SELECT * FROM orders_table WHERE user_id = ($1)';
    private readonly SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID =
        'SELECT * FROM orders_table WHERE user_id = ($1) AND status = ($2)';
    private readonly SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS = `SELECT * FROM orders_table WHERE user_id = ($1) AND status = 'active'`;
    private readonly SQL_DELETE_ORDER_BY_USER_ID =
        'DELETE FROM orders_table WHERE user_id = ($1) RETURNING *';
    private readonly SQL_UPDATE_ORDER_STATUS =
        'UPDATE orders_table SET status = ($1) WHERE user_id = ($2) AND id = ($3) RETURNING *';
    private readonly SQL_CREATE_ORDER =
        'INSERT INTO orders_table (id, user_id, status) VALUES(COALESCE((SELECT MAX(id) FROM orders_table), 0) + 1, $1, $2) RETURNING *';
    private readonly SQL_CREATE_ORDER_FOR_TEST =
        'INSERT INTO orders_table (id, user_id, status) VALUES($1, $2, $3)';
    private readonly SQL_DELETE_ALL_ORDERS = 'DELETE FROM orders_table';

    constructor() {
        super();
    }

    async getAllOrders(): Promise<IOrders[]> {
        return await this.getAllItems<IOrders>(this.SQL_GET_ALL_ORDERS);
    }

    async getAllOrdersByUserId(userId: number): Promise<IOrders[]> {
        const conn = await client.connect();
        const sql = this.SQL_GET_ALL_ORDFERS_BY_USER_ID;
        const result = await conn.query(sql, [userId]);
        conn.release();
        return result.rows;
    }

    async getAllSpecificStatusOrdersByUserId(
        userId: number,
        status: TStatus,
    ): Promise<IOrders[]> {
        const conn = await client.connect();
        const sql = this.SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID;
        const result = await conn.query(sql, [userId, status]);
        conn.release();
        return result.rows;
    }

    async getCurrentOrder(userId: number): Promise<IOrders | null> {
        const conn = await client.connect();
        const sql = this.SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS;
        const result = await conn.query(sql, [userId]);
        conn.release();

        const orders = result.rows as IOrders[];

        if (orders.length === 0) return null;

        const currentOrder = orders.reduce(
            (latest: IOrders, current: IOrders) =>
                (current.timestamp !== undefined && current.timestamp) >
                (latest.timestamp !== undefined && latest.timestamp)
                    ? current
                    : latest,
            orders[0],
        );

        return currentOrder;
    }

    async createOrder(order: IOrders): Promise<IOrders> {
        const conn = await client.connect();
        const sql = this.SQL_CREATE_ORDER;
        const result = await conn.query(sql, [
            order.user_id,
            order.status as TStatus,
        ]);
        conn.release();
        return result.rows[0];
    }

    async createRandomOrders(): Promise<boolean> {
        const existingOrders = await this.getAllOrders();

        if (existingOrders.length !== 0) return false;

        const conn = await client.connect();
        for (const order of randomOrders) {
            const sql = this.SQL_CREATE_ORDER_FOR_TEST;
            await conn.query(sql, [
                order.id,
                order.user_id,
                order.status as TStatus,
            ]);
        }
        conn.release();

        return true;
    }

    async deleteAllOrders(): Promise<void> {
        await this.deleteAllItems(this.SQL_DELETE_ALL_ORDERS);
    }

    async completeOrder(
        userId: number,
        orderId: number,
        status: TStatus,
    ): Promise<IOrders | null> {
        const conn = await client.connect();
        const sql = this.SQL_UPDATE_ORDER_STATUS;
        const result = await conn.query(sql, [status, userId, orderId]);

        conn.release();

        const completedOrder = result.rows[0];
        if (!completedOrder) return null;
        return result.rows[0];
    }

    // async deleteOrderById(id: number): Promise<IOrders | null> {
    //     return await this.deleteItemById(id, this.SQL_DELETE_ORDER_BY_USER_ID);
    // }
}
