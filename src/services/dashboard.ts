import client from '../database';
import { IProductPopular } from '../interface';
import { Store } from '../models/utils/store';

export class DashboardQueries extends Store {
    private readonly SQL_MOST_POPULAR_PRODUCTS =
        'SELECT products_table.name, SUM(products_in_orders_table.quantity) as total_quantity FROM products_table JOIN products_in_orders_table ON products_table.id = products_in_orders_table.product_id GROUP BY products_table.name ORDER BY total_quantity DESC LIMIT 5';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async mostPopularProducts(): Promise<IProductPopular[]> {
        const conn = await client.connect();
        const sql = this.SQL_MOST_POPULAR_PRODUCTS;
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }
}
