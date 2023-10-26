import express from 'express';
import cors from 'cors';
import { AppRoute } from './AppRoute';
import { PORT } from './config';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';

import './controllers/routes/users/getAllUsers';

declare module 'express-serve-static-core' {
    interface Request {
        token?: string;
    }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(AppRoute.getInstance());
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`...listening port ${PORT}`);
});
