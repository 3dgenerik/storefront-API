import client from '../database';
import { IOrders, TStatus } from '../interface';
import { Store } from './utils/store';

export class OrdersStore extends Store {
    private readonly SQL_GET_ALL_ORDERS = 'SELECT * FROM orders_table';
    private readonly SQL_GET_ALL_ORDFERS_BY_USER_ID =
        'SELECT * FROM orders_table WHERE user_id = ($1)';
    private readonly SQL_GET_ALL_SPECIFIC_ORDERS_BY_USER_ID =
        'SELECT * FROM orders_table WHERE user_id = ($1) AND status = ($2)';
    private readonly SQL_GET_ALL_ORDERS_WITH_ACTIVE_STATUS = `SELECT * FROM orders_table WHERE user_id = ($1) AND status = 'active'`;

    constructor() {
        super();
        this.getAllItemsSqlQuery = this.SQL_GET_ALL_ORDERS;
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
                current.timestamp > latest.timestamp ? current : latest,
            orders[0],
        );

        return currentOrder;
    }
}
