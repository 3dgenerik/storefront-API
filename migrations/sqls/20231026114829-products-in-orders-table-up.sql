CREATE TABLE products_in_orders_table(
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    product_id INTEGER,
    order_id INTEGER,
    CONSTRAINT unique_product_order UNIQUE (product_id, order_id),
    CONSTRAINT FK_products FOREIGN KEY (product_id) REFERENCES products_table(id),
    CONSTRAINT FK_orders FOREIGN KEY (order_id) REFERENCES orders_table(id)
);