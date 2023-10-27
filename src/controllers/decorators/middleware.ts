import { RequestHandler } from 'express';
import 'reflect-metadata';
import { AppFeatures } from '../../constants';

export const middleware = (middleware: RequestHandler) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, key: string) => {
        const middlewares =
            Reflect.getMetadata(AppFeatures.MIDDLEWARE, target, key) || [];
        Reflect.defineMetadata(
            AppFeatures.MIDDLEWARE,
            [...middlewares, middleware],
            target,
            key,
        );
    };
};
