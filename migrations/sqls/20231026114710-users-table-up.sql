CREATE TABLE users_table (
    id SERIAL PRIMARY KEY, 
    first_name VARCHAR(255), 
    last_name VARCHAR(255), 
    password VARCHAR(2048)
    );
INSERT INTO users_table (first_name, last_name, password) VALUES('Mitar', 'Miric', ';ojsa;odfjh9802f982hf972hf');