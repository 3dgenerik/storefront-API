export class Dashboard extends Storage{
    private readonly SQL_GET_ALL_ORDERS = 'SELECT * FROM orders_table';
    private readonly SQL_GET_ALL_PRODUCTS = 'SELECT * FROM products_table';
    private readonly SQL_INSERT_PRODUCT_IN_ORDERS = 'INSERT INTO product_id '

    // CREATE TABLE orders (
    //     id SERIAL PRIMARY KEY,
    //     order_id INT,
    //     product_id INT,
    //     quantity INT,
    //     -- Dodavanje UNIQUE constraint na kombinaciju product_id i order_id
    //     CONSTRAINT unique_product_order UNIQUE (product_id, order_id)
    // );
}