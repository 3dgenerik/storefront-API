import { ProductsStore } from '../models/productsStore';
import { OrdersStore } from '../models/ordersStore';
import { ProductsInOrder } from '../models/productsInOrder';
import { UsersStore } from '../models/usersStore';
import { AppRoutePath } from '../constants';
import { IOrders } from '../interface';
import { request } from './utils/getRequest';
import { getToken } from './utils/getToken';

describe('Testing orders routes: ', () => {
    const usersStore = new UsersStore();
    const productsStore = new ProductsStore();
    const ordersStore = new OrdersStore();
    const productsInOrder = new ProductsInOrder();

    let token = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAnOrder = (obj: any): obj is IOrders => {
        return 'user_id' in obj && 'status' in obj;
    };

    beforeAll(async () => {
        await usersStore.createRandomUsers();
        await productsStore.createRandomProducts();
        await ordersStore.createRandomOrders();
        await productsInOrder.createRandomProductInOrders();
        token = await getToken();
    });

    describe('Testing all orders by specific user id:', () => {
        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS} should return status code 200 and order list length greater than 0.`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS}`,
            );
            const allOrdersByUser = result.body as IOrders[];
            expect(allOrdersByUser.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/30${AppRoutePath.ENDPOINT_ORDERS} should return status code 200. Error message: Orders list is empty.`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/30${AppRoutePath.ENDPOINT_ORDERS}`,
            );
            expect(result.text).toEqual('Orders list is empty.');
            expect(result.status).toBe(200);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/notANumber${AppRoutePath.ENDPOINT_ORDERS} should return status code 400. Error message: Bad request. Invalid params for userId. Id param(s) must be positive integer number.`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/notANumber${AppRoutePath.ENDPOINT_ORDERS}`,
            );
            expect(result.text).toEqual(
                'Bad request. Invalid params for userId. Id param(s) must be positive integer number.',
            );
            expect(result.status).toBe(400);
        });
    });

    describe('Testing orders where status is active by specific user id: ', () => {
        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS}/status?status=active should return status code 200 and get orders length greater than 0`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS}/status?status=active`,
            );
            const allOrdersByUser = result.body as IOrders[];
            expect(allOrdersByUser.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS}/status?status=active should return status code 200. Error message: Orders list with status active is empty.`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/100${AppRoutePath.ENDPOINT_ORDERS}/status?status=active`,
            );
            expect(result.text).toEqual(
                'Orders list with status active is empty.',
            );
            expect(result.status).toBe(200);
        });
    });

    describe('Testing current (last created) orders by user id: ', () => {
        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/2${AppRoutePath.ENDPOINT_ORDERS}/current should return status code 200 and current order { id: 2, user_id: 2, status: 'active'} [TOKEN REQUIRED].`, async () => {
            const result = await request
                .get(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/2${AppRoutePath.ENDPOINT_ORDERS}/current`,
                )
                .set('Authorization', `Bearer ${token}`);
            const currentOrder = (await result.body) as IOrders;
            expect({
                id: currentOrder.id,
                user_id: currentOrder.user_id,
                status: currentOrder.status,
            }).toEqual({
                id: 2,
                user_id: 2,
                status: 'active',
            });
            expect(result.status).toBe(200);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/10000${AppRoutePath.ENDPOINT_ORDERS}/current should return status code 404. Error message: Current order not found. [TOKEN REQUIRED]`, async () => {
            const result = await request
                .get(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/10000${AppRoutePath.ENDPOINT_ORDERS}/current`,
                )
                .set('Authorization', `Bearer ${token}`);
            expect(result.text).toEqual('Current order not found.');
            expect(result.status).toBe(404);
        });
    });

    describe('Testing create order: ', () => {
        it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}/create should return status code 200 and check if added order is IOrder [TOKEN REQUIRED]`, async () => {
            const order: IOrders = {
                user_id: 5,
                status: 'active',
            };
            const result = await request
                .post(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}/create`,
                )
                .set('Authorization', `Bearer ${token}`)
                .send(order);

            const addedOrder = result.body as IOrders;
            expect(isAnOrder(addedOrder)).toBe(true);
            expect(result.status).toEqual(200);
        });

        it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}/create testing body validation middleware with wrong parameters. Error message:  Bad request. Please provide correct values [TOKEN REQUIRED]`, async () => {
            const order = {};
            const result = await request
                .post(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_ORDERS}/create`,
                )
                .set('Authorization', `Bearer ${token}`)
                .send(order);

            expect(result.text).toEqual(
                `Can't sign in. Please provide correct values.`,
            );
            expect(result.status).toEqual(400);
        });

        describe('Testing complete order by specific user id', () => {
            it(`PUT: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/12${AppRoutePath.ENDPOINT_ORDERS}/14 should return status code 200 and check if completed order is IOrder. [TOKEN REQUIRED]`, async () => {
                const result = await request
                    .put(
                        `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/12${AppRoutePath.ENDPOINT_ORDERS}/14`,
                    )
                    .set('Authorization', `Bearer ${token}`);
                const completedOrder = (await result.body) as IOrders;
                expect(isAnOrder(completedOrder)).toBe(true);
                expect(result.status).toBe(200);
            });

            it(`PUT: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/100000${AppRoutePath.ENDPOINT_ORDERS}/100000 should return status code 404: Error message: Bad request. User or order doesn't exist. Can't complete order [TOKEN REQUIRED]`, async () => {
                const result = await request
                    .put(
                        `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/100000${AppRoutePath.ENDPOINT_ORDERS}/100000`,
                    )
                    .set('Authorization', `Bearer ${token}`);
                expect(result.text).toEqual(
                    `Bad request. User or order doesn't exist. Can't complete order.`,
                );
                expect(result.status).toBe(404);
            });
        });
    });

    afterAll(async () => {
        await productsInOrder.deleteAllProductInOrders();
        await ordersStore.deleteAllOrders();
        await productsStore.deleteAllProducts();
        await usersStore.deleteAllUsers();
    });
});
