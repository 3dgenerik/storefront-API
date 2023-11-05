import { UsersStore } from '../models/usersStore';
import { ProductsStore } from '../models/productsStore';
import { OrdersStore } from '../models/ordersStore';
import { ProductsInOrder } from '../models/productsInOrder';
import { IOrders, IProduct, IProductsInOrders, IUser } from '../interface';
import { DashboardQueries } from '../services/dashboard';

describe('Testing all models:', async () => {
    const usersStore = new UsersStore();
    const productsStore = new ProductsStore();
    const ordersStore = new OrdersStore();
    const productsInOrder = new ProductsInOrder();
    const dashboardQuery = new DashboardQueries();

    const password = 'password';
    let hash = '';

    const userAlreadyExist: IUser = {
        first_name: 'Katarina',
        last_name: 'Popovic',
        password: 'katarina',
    };

    const userNotExist: IUser = {
        first_name: 'Jovica',
        last_name: 'Cvetkovic',
        password: 'jovica',
    };

    const productAlreadyExist: IProduct = {
        name: 'Laptop',
        price: 799.99,
        category: 'electronics',
    };

    const productNotExist: IProduct = {
        name: 'Samsung Tablet',
        price: 256.99,
        category: 'electronics',
    };

    const productInOrderAlreadyExist: IProductsInOrders = {
        quantity: 3,
        product_id: 1,
        order_id: 1,
    };

    const productInOrderNotExist: IProductsInOrders = {
        quantity: 5,
        product_id: 10,
        order_id: 10,
    };

    beforeAll(async () => {
        //create some random test rows
        await usersStore.createRandomUsers();
        await productsStore.createRandomProducts();
        await ordersStore.createRandomOrders();
        await productsInOrder.createRandomProductInOrders();

        //mocking functions (we don't need this now)
        // spyOn(usersStore, 'getAllUsers').and.returnValue(Promise.resolve(randomUsers))
        // spyOn(productsStore, 'getAllProducts').and.returnValue(Promise.resolve(radnomProducts))
        // spyOn(ordersStore, 'getAllOrders').and.returnValue(Promise.resolve(randomOrders))
        // spyOn(productsInOrder, 'getAllProductInOrders').and.returnValue(Promise.resolve(randomProductInOrder))

        hash = await usersStore.passwordHash(password);
    });

    describe('Testing users: ', () => {
        it('Pasword hash should return string', async () => {
            expect(typeof hash).toBe('string');
        });

        it('Pasword compare with correct password should return true', async () => {
            const compare = await usersStore.passwordHashCompare(
                password,
                hash,
            );
            expect(compare).toBe(true);
        });

        it('Pasword compare with wrong password should return false', async () => {
            const compare = await usersStore.passwordHashCompare(
                'wrong-password',
                hash,
            );
            expect(compare).toBe(false);
        });

        it('getAllUsers() should be correctly defined', async () => {
            const allUsers = await usersStore.getAllUsers();
            expect(allUsers).toBeDefined();
        });

        it('getAllUsers() length should be greater then 0', async () => {
            const allUsers = await usersStore.getAllUsers();
            expect(allUsers.length).toBeGreaterThan(0);
        });

        it('userExist() should return false if user does not exist', async () => {
            const ifUserExist = await usersStore.userExist(userNotExist);
            expect(ifUserExist).toEqual(false);
        });

        it('userExist() should return true if user exist', async () => {
            const ifUserExist = await usersStore.userExist(userAlreadyExist);
            expect(ifUserExist).toEqual(true);
        });

        it('getUserById() should return user if id exist', async () => {
            const user = await usersStore.getUserById(2);
            expect({
                id: user?.id,
                first_name: user?.first_name,
                last_name: user?.last_name,
            }).toEqual({ id: 2, first_name: 'Nikola', last_name: 'Jovanovic' });
        });

        it('getUserById() should return null if id does not exist', async () => {
            const user = await usersStore.getUserById(1000);
            expect(user).toBe(null);
        });

        it('createUser() should create user if user does not exist. Return user', async () => {
            const user = await usersStore.createUser({
                first_name: 'User first name',
                last_name: 'user_last_name',
                password: 'password',
            });
            expect({
                first_name: user?.first_name,
                last_name: user?.last_name,
            }).toEqual({
                first_name: 'User first name',
                last_name: 'user_last_name',
            });
        });

        it('createUser() should return null if user exist.', async () => {
            const user = await usersStore.createUser(userAlreadyExist);
            expect(user).toBe(null);
        });

        it('authUser() should be truthy if login in successfuly.', async () => {
            const user = await usersStore.authUser(userAlreadyExist);
            expect(user).toBeTruthy();
        });

        it('authUser() should return null if login is not successful', async () => {
            const user = await usersStore.authUser(userNotExist);
            expect(user).toBe(null);
        });

        describe('Testing products: ', async () => {
            it('getAllProducts() should be correctly defined', async () => {
                const product = await productsStore.getAllProducts();
                expect(product).toBeDefined();
            });

            it('getAllProducts() length should be greater then 0', async () => {
                const product = await productsStore.getAllProducts();
                expect(product.length).toBeGreaterThan(0);
            });

            it('productExist() should return true if product exist', async () => {
                const product =
                    await productsStore.productExist(productAlreadyExist);
                expect(product).toBe(true);
            });

            it('productExist() should return false if product exist', async () => {
                const product =
                    await productsStore.productExist(productNotExist);
                expect(product).toBe(false);
            });

            it('createProduct() should create product if product does not exist. Return product.', async () => {
                const newProduct: IProduct = {
                    name: 'wardrobe',
                    price: 569.99,
                    category: 'furniture',
                };
                const createdProduct =
                    await productsStore.createProduct(newProduct);
                expect({
                    ...createdProduct,
                    price: Number(createdProduct?.price),
                }).toEqual({
                    id: 36,
                    name: 'wardrobe',
                    price: 569.99,
                    category: 'furniture',
                });
            });

            it('createProduct() should return null if product exist.', async () => {
                const createdProduct =
                    await productsStore.createProduct(productAlreadyExist);
                expect(createdProduct).toBe(null);
            });

            it('getProductsByCategory() should return list of products with defined category', async () => {
                const productsByCategory =
                    await productsStore.getProductsByCategory('electronics');
                expect(productsByCategory.length).toBeGreaterThan(0);
            });

            it('getProductsByCategory() should return empty array when category argument does not match.', async () => {
                const productsByCategory =
                    await productsStore.getProductsByCategory('vehicles');
                expect(productsByCategory.length).toBe(0);
            });
        });

        describe('Testing orders: ', () => {
            it('getCurrentOrder() should return id 6 of last created active order.', async () => {
                const lastCreatedActiveOrder =
                    await ordersStore.getCurrentOrder(1);
                // console.log(lastCreatedActiveOrder);
                expect(lastCreatedActiveOrder?.id).toEqual(6);
            });

            it('getAllOrders() should return list of orders.', async () => {
                const allOrders = await ordersStore.getAllOrders();
                expect(allOrders.length).toBeGreaterThan(0);
            });

            it('getAllOrdersByUserId() should return list of orders by specific user id', async () => {
                const allOrdersByUserId =
                    await ordersStore.getAllOrdersByUserId(1);
                expect(allOrdersByUserId.length).toEqual(3);
            });

            it('getAllOrdersByUserId() should return empty list of orders if user id does not exist.', async () => {
                const allOrdersByUserId =
                    await ordersStore.getAllOrdersByUserId(10000);
                expect(allOrdersByUserId.length).toEqual(0);
            });

            it('getAllSpecificStatusOrdersByUserId() should return list with length of 2. Status = active', async () => {
                const allProductsBySpecificStatus =
                    await ordersStore.getAllSpecificStatusOrdersByUserId(
                        1,
                        'active',
                    );
                expect(allProductsBySpecificStatus.length).toEqual(2);
            });

            it('getAllSpecificStatusOrdersByUserId() should return list with length of 1. Status = complete', async () => {
                const allProductsBySpecificStatus =
                    await ordersStore.getAllSpecificStatusOrdersByUserId(
                        1,
                        'complete',
                    );
                expect(allProductsBySpecificStatus.length).toEqual(1);
            });

            it('getCurrentOrder() should return null.', async () => {
                const lastCreatedActiveOrder =
                    await ordersStore.getCurrentOrder(25);
                expect(lastCreatedActiveOrder).toBe(null);
            });

            it('createOrder() should create order for specific user. Return order.', async () => {
                const newOrder: IOrders = {
                    user_id: 2,
                    status: 'active',
                };
                const createdOrder = await ordersStore.createOrder(newOrder);
                expect(createdOrder.id).toEqual(34);
            });

            it('completeOrder() should complete order for specific user', async () => {
                const completeOrder = await ordersStore.completeOrder(
                    2,
                    2,
                    'complete',
                );
                expect({
                    id: completeOrder?.id,
                    user_id: completeOrder?.user_id,
                    status: completeOrder?.status,
                }).toEqual({
                    id: 2,
                    user_id: 2,
                    status: 'complete',
                });
            });

            it('completeOrder() should return null if there is no order for specific user', async () => {
                const completeOrder = await ordersStore.completeOrder(
                    100000,
                    100000,
                    'complete',
                );
                expect(completeOrder).toBe(null);
            });
        });

        describe('Testing products-in-orders', () => {
            it('getAllProductInOrders() should return list of products-in-orders', async () => {
                const getAllProductInOrders =
                    await productsInOrder.getAllProductInOrders();
                expect(getAllProductInOrders.length).toBeGreaterThan(0);
            });

            it('createProductsInOrders() should return newly created products-in-orders if success.', async () => {
                const createdProductInOrder =
                    await productsInOrder.createProductsInOrders(
                        productInOrderNotExist,
                    );
                expect(createdProductInOrder).toEqual({
                    id: 38,
                    quantity: 5,
                    product_id: 10,
                    order_id: 10,
                });
            });

            it('createProductsInOrders() should return SQL ERROR when products-in-orders already exist.', async () => {
                try {
                    await productsInOrder.createProductsInOrders(
                        productInOrderAlreadyExist,
                    );
                } catch (err) {
                    expect(err instanceof Error).toBe(true);
                }
            });
        });

        describe('Testing dashboard: ', () => {
            it('mostPopularProducts() should have length of 5 elements, and first element is: { name: "Coffee", total_quantity: 20}', async () => {
                const popularProducts =
                    await dashboardQuery.mostPopularProducts();
                expect(popularProducts.length).toEqual(5);
                expect({
                    ...popularProducts[0],
                    total_quantity: Number(popularProducts[0].total_quantity),
                }).toEqual({ name: 'Coffee', total_quantity: 20 });
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
