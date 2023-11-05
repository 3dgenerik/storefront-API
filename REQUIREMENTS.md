# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
<br />

## Users endpoints
<br />

#### [GET] Get all users [TOKEN REQUIRED]
http://localhost:3001/api/users

<br />

#### [GET] Get users by id [TOKEN REQUIRED]

    //example
    http://localhost:3001/api/users/1

http://localhost:3001/api/users/:id

<br />

#### [POST] Create users [CREATE JWT TOKEN]

    // body example
    {
        "first_name": "John",
        "last_name": "Doe",
        "password": "password"
    }

http://localhost:3001/api/users/signup

<br />

#### [POST] Auth user (sign in user) [CREATE JWT TOKEN]

    // body example
    {
        "first_name": "John",
        "last_name": "Doe",
        "password": "password"
    }

http://localhost:3001/api/users/signin

<br />

#### [GET] Get current user (get last signup or signed in user). This actually use decoded JWT which are assigned to req.session (using cookie-session) in token verify middleware. [TOKEN REQUIRED]

http://localhost:3001/api/users/current

<br />

#### Note: If we are using Postman then for every token required endpoint we must manualy copy JWT to Authorization->Bearer Token->Token

<br />
<br />

## Products endpoints
<br />

#### [GET] Get all products
http://localhost:3001/api/products

<br />

#### [GET] Get products by categories

    //you can use one of the following categories: electronics | clothing | appliances | furniture | rest | vehicles
    http://localhost:3001/api/products/category/clothing

http://localhost:3001/api/products/category/:category

<br />

#### [POST] Create product [TOKEN REQUIRED]

    // body example
    {
        "name": "Desk",
        "price": 229.99,
        "category": "furniture"
    }

http://localhost:3001/api/products

<br />
<br />

## Orders endpoints
<br />

#### [GET] Get current order by user. This endpoint is responsible for retrieving the most recent actuall order.  [TOKEN REQUIRED]

    //example
    http://localhost:3001/api/users/1/orders/current

http://localhost:3001/api/users/:id/orders/current

<br />

#### [GET] Get all orders by user id depending on order status.

    //example
    //status can be active | complete
    http://localhost:3001/api/users/1/orders/status?status=active

http://localhost:3001/api/users/:id/orders/status

<br />

#### [GET] Get all orders by user id.

    //example
    http://localhost:3001/api/users/1/orders

http://localhost:3001/api/users/:userId/orders

<br />

#### [POST] Create order [TOKEN REQUIRED]

    //body example
    {
        "user_id":5,
        "status":"active"
    }

http://localhost:3001/api/orders/create

<br />

#### [PUT] Complete order (change status from 'active' to 'complete')[TOKEN REQUIRED]

    //example
    http://localhost:3001/api/users/2/orders/2

http://localhost:3001/api/users/:userId/orders/:orderId

<br />
<br />

## Products-in-order endpoints
<br />

#### [POST] Create products-in-order.  [TOKEN REQUIRED]

http://localhost:3001/api/orders/products/create

<br />
<br />

## Dashboard endpoints
<br />

#### [GET] Most popular products. Get top 5 products with highest total quantity.

http://localhost:3001/api/products/popular

<br />
<br />


## Data Shapes
#### products_table shema
-  id
- name
- price
- category
#### SQL

    CREATE TABLE products_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        price DECIMAL(10,2),
        category VARCHAR(255)
    );

<br />

#### users_table shema
- id
- firstName
- lastName
- password
#### SQL

    CREATE TABLE users_table (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255), 
        last_name VARCHAR(255), 
        password VARCHAR(2048)
    );

<br />

#### orders_table shema
- id
- user_id (referenced to users_table.id)
- status
- timestamp
#### SQL

    CREATE TABLE orders_table(
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        status VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT FK_users FOREIGN KEY (user_id) REFERENCES users_table(id) 
    );

<br />

#### products_in_orders_table shema
- id
- quantity
- product_id (referenced to products_table.id)
- order_id (referenced to orders_table.id)
#### SQL

    CREATE TABLE products_in_orders_table(
        id SERIAL PRIMARY KEY,
        quantity INTEGER,
        product_id INTEGER,
        order_id INTEGER,
        CONSTRAINT unique_product_order UNIQUE (product_id, order_id),
        CONSTRAINT FK_products FOREIGN KEY (product_id) REFERENCES products_table(id),
        CONSTRAINT FK_orders FOREIGN KEY (order_id) REFERENCES orders_table(id)
    );


