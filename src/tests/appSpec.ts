import app from '../app';
import supertest from 'supertest';
import { AppRoutePath } from '../constants';
import { IUser } from '../interface';
import { OrdersStore } from '../models/ordersStore';
import { ProductsInOrder } from '../models/productsInOrder';
import { ProductsStore } from '../models/productsStore';
import { UsersStore } from '../models/usersStore';

const request = supertest(app);

describe('Testing routes: ', () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdF9uYW1lIjoiS2F0YXJpbmEiLCJsYXN0X25hbWUiOiJQb3BvdmljIiwicGFzc3dvcmQiOiIkMmIkMTAkbE5ONGoua3RiUWxFQ3ZKOTlDL3pGTzFEcGdxRGtkTWRSTGNSREZ5eUlKbTBmRmhucm5ySmUifSwiaWF0IjoxNjk5MTAwNTY5fQ.J7TNKFUN1b61BcOKop3yKl9lv8VL3-Jz2Ixr4rpO2Ho';

    describe('Testing user routes: ', () => {
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

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS} getAllusers() should return status 200, users.length > 0 [TOKEN REQUIRED]`, async () => {
            const result = await request
                .get(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}`,
                )
                .set('Authorization', `Bearer ${token}`);

            const users = result.body as IUser[];

            expect(users.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}  should return status 401 without or wrong token [TOKEN REQUIRED]`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}`,
            );
            expect(result.status).toBe(401);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/current should return User object with id = 3 [TOKEN REQUIRED]`, async () => {
            const result = await request
                .get(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/current`,
                )
                .set('Authorization', `Bearer ${token}`);

            const currentUser = (await result.body) as IUser;

            expect(currentUser).toEqual({
                id: 3,
                first_name: 'Katarina',
                last_name: 'Popovic',
                password:
                    '$2b$10$lNN4j.ktbQlECvJ99C/zFO1DpgqDkdMdRLcRDFyyIJm0fFhnrnrJe',
            });
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/current should return 401 without or wrong token [TOKEN REQUIRED]`, async () => {
            const result = await request.get(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/current`,
            );

            expect(result.status).toEqual(401);
        });

        it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1 should return user with id 1, first_name = 'Milena', last_name = 'Petrovic'`, async () => {
            const result = await request
                .get(
                    `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1`,
                )
                .set('Authorization', `Bearer ${token}`);

            const user = result.body as IUser;
            expect({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
            }).toEqual({
                id: 1,
                first_name: 'Milena',
                last_name: 'Petrovic',
            });
            expect(result.status).toBe(200);
        });

        afterAll(async () => {
            await productsInOrder.deleteAllProductInOrders();
            await ordersStore.deleteAllOrders();
            await productsStore.deleteAllProducts();
            await usersStore.deleteAllUsers();
        });
    });
});
