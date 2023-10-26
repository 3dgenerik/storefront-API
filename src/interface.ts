export interface IStatusCode {
    statusCode: number;
}

export interface ICustomErrorMessage extends IStatusCode {
    message: string;
}

export interface ICustomError extends IStatusCode {
    formatMessage: () => ICustomErrorMessage;
}

export interface IUser {
    id?: number;
    firstName: string;
    lastName: string;
    password: string;
}

export interface IProduct {
    id?: number;
    name: string;
    price: number;
    category: string;
}

export interface IOrders {
    id?: number;
    user_id?: number;
    status: 'active' | 'complete';
}

export interface IProductsInOrders {
    id?: number;
    quantity: number;
    product_id: number;
    order_id: number;
}
