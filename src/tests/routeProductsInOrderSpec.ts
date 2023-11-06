import { ProductsStore } from '../models/productsStore';
import { OrdersStore } from '../models/ordersStore';
import { ProductsInOrder } from '../models/productsInOrder';
import { UsersStore } from '../models/usersStore';
import { AppRoutePath } from '../constants';
import { IProductsInOrders } from '../interface';
import { request } from './utils/getRequest';
import { getToken } from './utils/getToken';

describe('Testing product-in-orders routes: ', () => {
    const usersStore = new UsersStore();
    const productsStore = new ProductsStore();
    const ordersStore = new OrdersStore();
    const productsInOrder = new ProductsInOrder();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAnProductInOrder = (obj: any): obj is IProductsInOrders => {
        return 'quantity' in obj && 'product_id' in obj && 'order_id' in obj;
    };

    const uniqueProductInOrder: IProductsInOrders = {
        quantity: 1,
        product_id: 6,
        order_id: 6,
    };

    let token = '';

    beforeAll(async () => {
        await usersStore.createRandomUsers();
        await productsStore.createRandomProducts();
        await ordersStore.createRandomOrders();
        await productsInOrder.createRandomProductInOrders();
        token = await getToken();
    });

    describe('Testing create product-in-orders: ', () => {
        it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}${AppRoutePath.ENDPOINT_PRODUCTS}/create should return status code 200, check if created product-in-otder is IProductInOrder. Also return created user as object [TOKEN REQUIRED]`, async () => {
            const result = await request
                .post(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}${AppRoutePath.ENDPOINT_PRODUCTS}/create`,
                )
                .set('Authorization', `Bearer ${token}`)
                .send(uniqueProductInOrder);
            const createdProductInOrder =
                (await result.body) as IProductsInOrders;
            expect(isAnProductInOrder(createdProductInOrder)).toBe(true);
            expect(createdProductInOrder).toEqual({
                id: 38,
                quantity: 1,
                product_id: 6,
                order_id: 6,
            });
            expect(result.status).toBe(200);
        });

        it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}${AppRoutePath.ENDPOINT_PRODUCTS}/create testing body validator and should return status code 400. Error message: Bad request. Invalid values: quantity, product_id, order_id. Please provide correct values. [TOKEN REQUIRED]`, async () => {
            const result = await request
                .post(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}${AppRoutePath.ENDPOINT_PRODUCTS}/create`,
                )
                .set('Authorization', `Bearer ${token}`)
                .send({});

            expect(result.text).toEqual(
                'Bad request. Invalid values: quantity, product_id, order_id. Please provide correct values.',
            );
            expect(result.status).toEqual(400);
        });
    });

    afterAll(async () => {
        await productsInOrder.deleteAllProductInOrders();
        await ordersStore.deleteAllOrders();
        await productsStore.deleteAllProducts();
        await usersStore.deleteAllUsers();
    });
});
