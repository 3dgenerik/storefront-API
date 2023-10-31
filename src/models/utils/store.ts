import client from '../../database';

export class Store {
    protected getItemByIdSqlQuery: string = '';

    protected async getAllItems<T>(sql: string): Promise<T[]> {
        const conn = await client.connect();
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }

    protected async itemExistById(id: number): Promise<boolean> {
        const conn = await client.connect();
        const sql = this.getItemByIdSqlQuery;
        const result = await conn.query(sql, [id]);
        conn.release();
        const existingItem = result.rows[0];

        if (existingItem) return true;
        return false;
    }

    protected async itemById(id: number, sqlQuery: string) {
        if (!(await this.itemExistById(id))) return null;

        const conn = await client.connect();
        const sql = sqlQuery;
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }

    protected async getItemById<T>(
        id: number,
        sqlQuery: string,
    ): Promise<T | null> {
        return this.itemById(id, sqlQuery);
    }

    protected async deleteItemById<T>(
        id: number,
        sqlQuery: string,
    ): Promise<T | null> {
        return this.itemById(id, sqlQuery);
    }
}
