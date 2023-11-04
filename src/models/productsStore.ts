import client from '../database';
import { IProduct } from '../interface';
import { radnomProducts } from '../randomItems';
import { Store } from './utils/store';

export class ProductsStore extends Store {
    private readonly SQL_GET_ALL_PRODUCTS = 'SELECT * FROM products_table';
    private readonly SQL_IF_PRODUCT_EXIST =
        'SELECT * FROM products_table WHERE name = ($1) AND category = ($2)';
    private readonly SQL_GET_PRODUCT_BY_ID =
        'SELECT * FROM products_table WHERE id = ($1)';
    private readonly SQL_CREATE_PRODUCT =
        'INSERT INTO products_table (id, name, price, category) VALUES(COALESCE((SELECT MAX(id) FROM products_table), 0) + 1, $1, $2, $3) RETURNING *';
    private readonly SQL_CREATE_PRODUCT_FOR_TEST =
        'INSERT INTO products_table (id, name, price, category) VALUES($1, $2, $3, $4)';
    private readonly SQL_DELETE_PRODUCT =
        'DELETE FROM products_table WHERE id = ($1) RETURNING *';
    private readonly SQL_DELETE_ALL_PRODUCTS = 'DELETE FROM products_table';

    constructor() {
        super();
        this.getItemByIdSqlQuery = this.SQL_GET_PRODUCT_BY_ID;
    }

    async getAllProducts(): Promise<IProduct[]> {
        return await this.getAllItems<IProduct>(this.SQL_GET_ALL_PRODUCTS);
    }

    async productExist(product: IProduct): Promise<boolean> {
        const conn = await client.connect();
        const sql = this.SQL_IF_PRODUCT_EXIST;
        const result = await conn.query(sql, [product.name, product.category]);
        conn.release();
        const existingProduct = result.rows[0];

        if (existingProduct) return true;
        return false;
    }

    async getProductById(id: number): Promise<IProduct | null> {
        return await this.getItemById<IProduct>(id, this.SQL_GET_PRODUCT_BY_ID);
    }

    async createProduct(product: IProduct): Promise<IProduct | null> {
        if (await this.productExist(product)) {
            return null;
        }
        const conn = await client.connect();
        const sql = this.SQL_CREATE_PRODUCT;
        const result = await conn.query(sql, [
            product.name,
            product.price,
            product.category,
        ]);
        conn.release();
        return result.rows[0];
    }

    async createRandomProducts(): Promise<boolean> {
        const existingProducts = await this.getAllProducts();

        if (existingProducts.length !== 0) return false;

        const conn = await client.connect();
        for (const product of radnomProducts) {
            const sql = this.SQL_CREATE_PRODUCT_FOR_TEST;
            await conn.query(sql, [
                product.id,
                product.name,
                product.price,
                product.category,
            ]);
        }
        conn.release();

        return true;
    }

    async deleteAllProducts(): Promise<void> {
        await this.deleteAllItems(this.SQL_DELETE_ALL_PRODUCTS);
    }

    async deleteProductById(id: number): Promise<IProduct | null> {
        return await this.deleteItemById(id, this.SQL_DELETE_PRODUCT);
    }

    async getProductsByCategory(category: string): Promise<IProduct[]> {
        const conn = await client.connect();
        const sql = 'SELECT * FROM products_table WHERE category = ($1)';
        const result = await conn.query(sql, [category]);
        conn.release();
        return result.rows;
    }
}
