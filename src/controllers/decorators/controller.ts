import 'reflect-metadata';
import { AppFeatures, AppMethods, AppRoutePath } from '../../constants';
import { AppRoute } from '../../AppRoute';

export const controller = (prefixRoute: AppRoutePath) => {
    return (target: Function) => {
        const router = AppRoute.getInstance();
        const targetPrototype = Object.getOwnPropertyNames(target.prototype);
        for (const key of targetPrototype) {
            const path = Reflect.getMetadata(
                AppFeatures.PATH,
                target.prototype,
                key,
            );
            const method = Reflect.getMetadata(
                AppFeatures.METHOD,
                target.prototype,
                key,
            ) as AppMethods;
            const middleware = Reflect.getMetadata(
                AppFeatures.MIDDLEWARE,
                target.prototype,
                key
            ) || [];
            if (path && method) {
                router[method](`${prefixRoute}${path}`, ...middleware, target.prototype[key]);
            }
        }
    };
};
