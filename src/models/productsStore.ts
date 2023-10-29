import client from '../database';
import { IProduct } from '../interface';
import { Store } from './utils/store';

export class ProductsStore extends Store {
    private readonly SQL_GET_ALL_PRODUCTS = 'SELECT * FROM products_table';
    private readonly SQL_GET_PRODUCT_BY_ID = 'SELECT * FROM products_table WHERE id = ($1)';

    constructor(){
        super()
        this.getAllItemsSqlQuery = this.SQL_GET_ALL_PRODUCTS;
    }

    async getAllProducts(): Promise<IProduct[]> {
        return await this.getAllItems<IProduct> ()
    }

    private async productExist(product: IProduct): Promise<boolean> {
        const conn = await client.connect()
        const sql = 'SELECT * FROM products_table WHERE name = ($1) AND category = ($2)'
        const result = await conn.query(sql, [product.name, product.category])
        conn.release()
        const existingProduct = result.rows[0]

        if(existingProduct)
            return true;
        return false;
    }


    // async getProductById(id: number): Promise<IProduct>{
    //     const conn = await client.connect()
    //     const sql = 
    // }
}
