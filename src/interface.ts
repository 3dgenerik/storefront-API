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
    first_name: string;
    last_name: string;
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

export interface IBodyValidator {
    first_name?: string;
    last_name?: string;
    password?: string;
    name?: string;
    price?: number;
    category?: string;
    status?: 'active' | 'complete';
    quantity?: number;
    product_id?: number;
    order_id?: number;
}

export interface IToken {
    user: IUser;
    iat?: number;
}
