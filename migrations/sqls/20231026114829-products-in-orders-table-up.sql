CREATE TABLE products_in_orders_table(
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    product_id INTEGER,
    order_id INTEGER,
    CONSTRAINT FK_products FOREIGN KEY (product_id) REFERENCES products_table(id),
    CONSTRAINT FK_orders FOREIGN KEY (order_id) REFERENCES orders_table(id)
);