import app from '../app';
import supertest from 'supertest';
import { ProductsStore } from '../models/productsStore';
import { OrdersStore } from '../models/ordersStore';
import { ProductsInOrder } from '../models/productsInOrder';
import { UsersStore } from '../models/usersStore';
import { AppRoutePath } from '../constants';
import { IProductPopular } from '../interface';

const request = supertest(app);

describe('Testing dashboard routes: ', () => {
    const usersStore = new UsersStore();
    const productsStore = new ProductsStore();
    const ordersStore = new OrdersStore();
    const productsInOrder = new ProductsInOrder();

    beforeAll(async () => {
        await usersStore.createRandomUsers();
        await productsStore.createRandomProducts();
        await ordersStore.createRandomOrders();
        await productsInOrder.createRandomProductInOrders();
    });

    describe('Testing get most popular products', () => {
        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/popular should return status code 200, and popular products length = 5. Also sum of all total_quantity = 55`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/popular`,
            );

            const popularProductsList =
                (await result.body) as IProductPopular[];

            const totalSum = popularProductsList.reduce(
                (acc: number, product: IProductPopular) => {
                    return acc + Number(product.total_quantity);
                },
                0,
            );

            expect(popularProductsList.length).toEqual(5);
            expect(totalSum).toEqual(55);
            expect(result.status).toBe(200);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/popular should return status code 200, and popular products length = 5. Also sum of all total_quantity = 55`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/popular`,
            );

            const popularProductsList =
                (await result.body) as IProductPopular[];

            const totalSum = popularProductsList.reduce(
                (acc: number, product: IProductPopular) => {
                    return acc + Number(product.total_quantity);
                },
                0,
            );                

            expect(popularProductsList.length).toEqual(5);
            expect(totalSum).toEqual(55);
            expect(result.status).toBe(200);
        });
    });

    afterAll(async () => {
        await productsInOrder.deleteAllProductInOrders();
        await ordersStore.deleteAllOrders();
        await productsStore.deleteAllProducts();
        await usersStore.deleteAllUsers();
    });
});
