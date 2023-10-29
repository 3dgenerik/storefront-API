CREATE TABLE orders_table(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    status VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_users FOREIGN KEY (user_id) REFERENCES users_table(id) 
);