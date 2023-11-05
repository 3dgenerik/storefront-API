# Storefront backend project

### Database setup

#### Here is a way how to setup our database:

    1. psql -U postgres
    2. type postgres password
    3. CREATE USER <new_user> WITH PASSWORD <user_password>;
    4. CREATE DATABASE storefront_dev;
    5. CREATE DATABASE storefront_dev;
    6. \c storefront_dev
    7. GRANT ALL ON SCHEMA public TO <new_user>;
    8. \c storefront_test
    9. GRANT ALL ON SCHEMA public TO <new_user>;


#### Note: Points 7 and 9 are not necessary if we use SUPERUSER (user with all privileges)

#### Let's assume that we want to use the newly created user <new_user>, we need to update folowing files:
    - .env
    - database.json

#### .env file should look like this:

    PORT=3001
    ENV=dev
    POSTGRES_HOST=127.0.0.1
    POSTGRES_USER=<new_user>
    POSTGRES_DB=storefront_dev
    POSTGRES_DB_TEST=storefront_test
    POSTGRES_PASSWORD=<user_password>
    SALT_ROUND=10
    SECRET_TOKEN=secret
    COOKIE_SESSION_SECRET_KEY=secret

#### database.json file should look like this:

{

    "dev":{

        "driver":"pg",
        "host":"127.0.0.1",
        "user":"<new_user>",
        "database":"storefront_dev",
        "password":"<user_password>"

    },

    "test":{

        "driver":"pg",
        "host":"127.0.0.1",
        "user":"<new_user>",
        "database":"storefront_test",
        "password":"<user_password>"

    }
}


### Scripts

    "build": "npx tsc",
    "start:build": "tsc -w",
    "start:run": "nodemon build/app.js",
    "start": "concurrently npm:start:*",
    "prettier": "prettier --config .prettierrc src/**/*.ts --write",
    "lint": "eslint src/**/*.ts",
    "up": "db-migrate --env test up && db-migrate up",
    "down": "db-migrate --env test down && db-migrate down",
    "reset": "db-migrate --env test reset && db-migrate reset",
    "jasmine": "jasmine",
    "test": "set ENV=test&& db-migrate --env test up && npm run build && npm run jasmine && db-migrate db:drop test"

### Scripts explanations

    npm run build - create build only
    npm start - run build and nodemon in live mode
    npm run prettier - run prettier
    npm run lint - run lint
    npm run up - create tables
    npm run reset - drop all tables
    npm test - run testing mode
<br />

## IMPORTANT NOTES BEFORE WE GO TO ENPOINTS
For DEV mode first of all we need to run following command to create tables:

    npm run up

This will create the tables in the following order:

    users_table
    products_table
    orders_table
    products_in_order_table

Order is very important because orders_table has CONSTRAINT to user_id from users_table, and products_in_order_table has CONSTRAINTS to products_id from products_table and to orders_id from orders_table.

<br />
<br />

# Endpoints
<br />

## Users endpoints
<br />

#### Get all users [TOKEN REQUIRED]
http://localhost:3001/api/users

<br />

#### Get users by id [TOKEN REQUIRED]

    //example
    http://localhost:3001/api/users/1

http://localhost:3001/api/users/:id

<br />

#### Create users [CREATE JWT TOKEN]

    // body example
    {
        "first_name": "John",
        "last_name": "Doe",
        "password": "password"
    }

http://localhost:3001/api/users/signup

<br />

#### Auth user (sign in user) [CREATE JWT TOKEN]

    // body example
    {
        "first_name": "John",
        "last_name": "Doe",
        "password": "password"
    }

http://localhost:3001/api/users/signin

<br />

#### Get current user (get last signup or signed in user) [TOKEN REQUIRED]
http://localhost:3001/api/users/current

<br />







