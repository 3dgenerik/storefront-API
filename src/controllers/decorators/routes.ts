import { AppFeatures, AppMethods } from '../../constants';
import 'reflect-metadata';

export const routerWrapper = (method: AppMethods) => {
    return (path: string) => {
        return (target: any, key: string) => {
            Reflect.defineMetadata(AppFeatures.PATH, path, target, key);
            Reflect.defineMetadata(AppFeatures.METHOD, method, target, key);
        };
    };
};

export const get = routerWrapper(AppMethods.GET);
export const post = routerWrapper(AppMethods.POST);
export const put = routerWrapper(AppMethods.PUT);
export const del = routerWrapper(AppMethods.DELETE);
