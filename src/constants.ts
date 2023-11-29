export const enum AppRoutePath {
    ROOT = '/',
    PREFIX_ROUTE = '/api',
    ENDPOINT_USERS = '/users',
    ENDPOINT_PRODUCTS = '/products',
    ENDPOINT_ORDERS = '/orders',
    ENDPOINT_PRODUCTS_IN_ORDERS = '/products_in_orders'
}

export const enum AppMethods {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
}

export const enum AppFeatures {
    PATH = 'path',
    METHOD = 'method',
    VALIDATION = 'validation',
    MIDDLEWARE = 'middleware',
}
