import client from '../../database';

export class Store {
    protected getItemByIdSqlQuery: string = '';

    protected async getAllItems<T>(sql: string): Promise<T[]> {
        try{
            const conn = await client.connect();
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }catch(err){
            throw new Error(`Cannot get all items: ${err}`)
        }
    }

    protected async itemExistById(id: number): Promise<boolean> {
        try{

            const conn = await client.connect();
            const sql = this.getItemByIdSqlQuery;
            const result = await conn.query(sql, [id]);
            conn.release();
            const existingItem = result.rows[0];
    
            if (existingItem) return true;
            return false;
        }catch(err){
            throw new Error(`Cannot get item: ${err}`)
        }
    }

    protected async itemById(id: number, sqlQuery: string) {
        try{

            if (!(await this.itemExistById(id))) return null;
    
            const conn = await client.connect();
            const sql = sqlQuery;
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }catch(err){
            throw new Error(`Cannot get item: ${err}`)
        }
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

    protected async deleteAllItems(sql: string): Promise<void> {
        try{
            const conn = await client.connect();
            await conn.query(sql);
            conn.release();
        }catch(err){
            throw new Error(`Cannot delete items ${err}`)
        }
    }
}
