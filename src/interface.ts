export interface IStatusCode {
    statusCode: number;
}

export interface ICustomErrorMessage extends IStatusCode {
    message: string;
}

export interface ICustomError extends IStatusCode {
    formatMessage: () => ICustomErrorMessage;
}

export interface IItemId {
    id?: number;
}

export interface IUser extends IItemId {
    first_name: string;
    last_name: string;
    password: string;
}

export const categories = [
    'electronics',
    'clothing',
    'appliances',
    'furniture',
    'rest',
] as const;
export type TCategory = (typeof categories)[number];

interface ICategory {
    category: TCategory;
}
export interface IProduct extends IItemId, ICategory {
    name: string;
    price: number;
}

export const statuses = ['active', 'complete'] as const;
export type TStatus = (typeof statuses)[number];

export interface IOrders extends IItemId {
    user_id?: number;
    status: TStatus;
}

export interface IProductsInOrders extends IItemId {
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
    category?: TCategory;
    status?: TStatus;
    quantity?: number;
    product_id?: number;
    order_id?: number;
}

export interface IToken {
    user: IUser;
    iat?: number;
}

export interface ICreatedUserOutput {
    output: {
        user: IUser | null;
        token: string;
    };
}
