import express from 'express';
import cors from 'cors';
import { AppRoute } from './AppRoute';
import { COOKIE_SESSION_SECRET_KEY, PORT } from './config';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import cookieSession from 'cookie-session';

import './controllers/routes/dashboard/mostPopularProductsController';
import './controllers/routes/dashboard/startController';

import './controllers/routes/users/getCurrentUser';
import './controllers/routes/users/getAllUsersController';
import './controllers/routes/users/createUserController';
import './controllers/routes/users/findUserByIdController';
import './controllers/routes/users/authUserController';
import './controllers/routes/users/createRandomUsers';

import './controllers/routes/products/getAllProductsController';
import './controllers/routes/products/createProductController';
import './controllers/routes/products/createRandomProducts';
import './controllers/routes/products/getProductsByCategories';

import './controllers/routes/orders/createOrderController';
import './controllers/routes/orders/getAllOrdersByUserIdController';
import './controllers/routes/orders/getAllSpecificOrdersByUserIdController';
import './controllers/routes/orders/getCurrentOrderByUserController';
import './controllers/routes/orders/completeOrdersController';
import './controllers/routes/orders/createRandomOrders';

import './controllers/routes/productsInOrder/createProductInOrderController';
import './controllers/routes/productsInOrder/createRandomProductsInOrderController';

import './controllers/routes/dashboard/deleteUserController';

// declare module 'express-serve-static-core' {
//     interface Request {
//         token?: IUser | null;
//     }
// }

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
    cookieSession({
        name: 'session',
        keys: [COOKIE_SESSION_SECRET_KEY!],
        maxAge: 2 * 60 * 60 * 1000,
    }),
);

app.use(AppRoute.getInstance());
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`...listening port ${PORT}`);
});

export default app;
