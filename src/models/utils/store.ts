import client from "../../database";
import { IItemId } from "../../interface";


export class Store {

    protected getAllItemsSqlQuery: string = '';

    protected async getAllItems<T>(): Promise<T[]> {
        const conn = await client.connect();
        const sql = this.getAllItemsSqlQuery;
        const result = await conn.query(sql);
        conn.release();
        return result.rows;
    }


    protected async itemExistById(id: number): Promise<boolean> {
        const allItems = await this.getAllItems<IItemId>();
        for (const item of allItems) {
            if (item.id === id) return true;
        }
        return false;
    }

    private async itemById(id: number, sqlQuery: string){
        if (!(await this.itemExistById(id))) return null;

        const conn = await client.connect();
        const sql = sqlQuery;
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }

    protected async showItemById<T>(id: number, sqlQuery: string): Promise<T | null> {
        return this.itemById(id, sqlQuery)
    }

    protected async deleteItemById<T>(id: number, sqlQuery: string): Promise<T | null> {
        return this.itemById(id, sqlQuery)
    }
}
