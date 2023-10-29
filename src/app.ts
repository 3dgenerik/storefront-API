import express from 'express';
import cors from 'cors';
import { AppRoute } from './AppRoute';
import { COOKIE_SESSION_SECRET_KEY, PORT } from './config';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import cookieSession from 'cookie-session';

import './controllers/routes/users/getAllUsersController';
import './controllers/routes/users/createUserController';
import './controllers/routes/users/findUserByIdController';
import './controllers/routes/users/authUserController';
import './controllers/routes/users/deleteUserController';
import './controllers/routes/users/createRandomUsers';

import './controllers/routes/products/getAllProductsController';
import './controllers/routes/products/createProductController';
import './controllers/routes/products/createRandomProducts';
import './controllers/routes/products/deleteProductController';
import './controllers/routes/products/getProductsByCategories';

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
