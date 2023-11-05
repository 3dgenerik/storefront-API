"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersStore_1 = require("../models/usersStore");
const productsStore_1 = require("../models/productsStore");
const ordersStore_1 = require("../models/ordersStore");
const productsInOrder_1 = require("../models/productsInOrder");
const dashboard_1 = require("../services/dashboard");
describe('Testing all models:', () => __awaiter(void 0, void 0, void 0, function* () {
    const usersStore = new usersStore_1.UsersStore();
    const productsStore = new productsStore_1.ProductsStore();
    const ordersStore = new ordersStore_1.OrdersStore();
    const productsInOrder = new productsInOrder_1.ProductsInOrder();
    const dashboardQuery = new dashboard_1.DashboardQueries();
    const password = 'password';
    let hash = '';
    const userAlreadyExist = {
        first_name: 'Katarina',
        last_name: 'Popovic',
        password: 'katarina',
    };
    const userNotExist = {
        first_name: 'Jovica',
        last_name: 'Cvetkovic',
        password: 'jovica',
    };
    const productAlreadyExist = {
        name: 'Laptop',
        price: 799.99,
        category: 'electronics',
    };
    const productNotExist = {
        name: 'Samsung Tablet',
        price: 256.99,
        category: 'electronics',
    };
    const productInOrderAlreadyExist = {
        quantity: 3,
        product_id: 1,
        order_id: 1,
    };
    const productInOrderNotExist = {
        quantity: 5,
        product_id: 10,
        order_id: 10,
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //create some random test rows
        yield usersStore.createRandomUsers();
        yield productsStore.createRandomProducts();
        yield ordersStore.createRandomOrders();
        yield productsInOrder.createRandomProductInOrders();
        //mocking functions (we don't need this now)
        // spyOn(usersStore, 'getAllUsers').and.returnValue(Promise.resolve(randomUsers))
        // spyOn(productsStore, 'getAllProducts').and.returnValue(Promise.resolve(radnomProducts))
        // spyOn(ordersStore, 'getAllOrders').and.returnValue(Promise.resolve(randomOrders))
        // spyOn(productsInOrder, 'getAllProductInOrders').and.returnValue(Promise.resolve(randomProductInOrder))
        hash = yield usersStore.passwordHash(password);
    }));
    describe('Testing users: ', () => {
        it('Pasword hash should return string', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(typeof hash).toBe('string');
        }));
        it('Pasword compare with correct password should return true', () => __awaiter(void 0, void 0, void 0, function* () {
            const compare = yield usersStore.passwordHashCompare(password, hash);
            expect(compare).toBe(true);
        }));
        it('Pasword compare with wrong password should return false', () => __awaiter(void 0, void 0, void 0, function* () {
            const compare = yield usersStore.passwordHashCompare('wrong-password', hash);
            expect(compare).toBe(false);
        }));
        it('getAllUsers() should be correctly defined', () => __awaiter(void 0, void 0, void 0, function* () {
            const allUsers = yield usersStore.getAllUsers();
            expect(allUsers).toBeDefined();
        }));
        it('getAllUsers() length should be greater then 0', () => __awaiter(void 0, void 0, void 0, function* () {
            const allUsers = yield usersStore.getAllUsers();
            expect(allUsers.length).toBeGreaterThan(0);
        }));
        it('userExist() should return false if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const ifUserExist = yield usersStore.userExist(userNotExist);
            expect(ifUserExist).toEqual(false);
        }));
        it('userExist() should return true if user exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const ifUserExist = yield usersStore.userExist(userAlreadyExist);
            expect(ifUserExist).toEqual(true);
        }));
        it('getUserById() should return user if id exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersStore.getUserById(2);
            expect({
                id: user === null || user === void 0 ? void 0 : user.id,
                first_name: user === null || user === void 0 ? void 0 : user.first_name,
                last_name: user === null || user === void 0 ? void 0 : user.last_name,
            }).toEqual({ id: 2, first_name: 'Nikola', last_name: 'Jovanovic' });
        }));
        it('getUserById() should return null if id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersStore.getUserById(1000);
            expect(user).toBe(null);
        }));
        it('createUser() should create user if user does not exist. Return user', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersStore.createUser({
                first_name: 'User first name',
                last_name: 'user_last_name',
                password: 'password',
            });
            expect({
                first_name: user === null || user === void 0 ? void 0 : user.first_name,
                last_name: user === null || user === void 0 ? void 0 : user.last_name,
            }).toEqual({
                first_name: 'User first name',
                last_name: 'user_last_name',
            });
        }));
        it('createUser() should return null if user exist.', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersStore.createUser(userAlreadyExist);
            expect(user).toBe(null);
        }));
        it('authUser() should be truthy if login in successfuly.', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersStore.authUser(userAlreadyExist);
            expect(user).toBeTruthy();
        }));
        it('authUser() should return null if login is not successful', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield usersStore.authUser(userNotExist);
            expect(user).toBe(null);
        }));
        describe('Testing products: ', () => __awaiter(void 0, void 0, void 0, function* () {
            it('getAllProducts() should be correctly defined', () => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productsStore.getAllProducts();
                expect(product).toBeDefined();
            }));
            it('getAllProducts() length should be greater then 0', () => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productsStore.getAllProducts();
                expect(product.length).toBeGreaterThan(0);
            }));
            it('productExist() should return true if product exist', () => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productsStore.productExist(productAlreadyExist);
                expect(product).toBe(true);
            }));
            it('productExist() should return false if product exist', () => __awaiter(void 0, void 0, void 0, function* () {
                const product = yield productsStore.productExist(productNotExist);
                expect(product).toBe(false);
            }));
            it('createProduct() should create product if product does not exist. Return product.', () => __awaiter(void 0, void 0, void 0, function* () {
                const newProduct = {
                    name: 'wardrobe',
                    price: 569.99,
                    category: 'furniture',
                };
                const createdProduct = yield productsStore.createProduct(newProduct);
                expect(Object.assign(Object.assign({}, createdProduct), { price: Number(createdProduct === null || createdProduct === void 0 ? void 0 : createdProduct.price) })).toEqual({
                    id: 36,
                    name: 'wardrobe',
                    price: 569.99,
                    category: 'furniture',
                });
            }));
            it('createProduct() should return null if product exist.', () => __awaiter(void 0, void 0, void 0, function* () {
                const createdProduct = yield productsStore.createProduct(productAlreadyExist);
                expect(createdProduct).toBe(null);
            }));
            it('getProductsByCategory() should return list of products with defined category', () => __awaiter(void 0, void 0, void 0, function* () {
                const productsByCategory = yield productsStore.getProductsByCategory('electronics');
                expect(productsByCategory.length).toBeGreaterThan(0);
            }));
            it('getProductsByCategory() should return empty array when category argument does not match.', () => __awaiter(void 0, void 0, void 0, function* () {
                const productsByCategory = yield productsStore.getProductsByCategory('vehicles');
                expect(productsByCategory.length).toBe(0);
            }));
        }));
        describe('Testing orders: ', () => {
            it('getCurrentOrder() should not return undefined.', () => __awaiter(void 0, void 0, void 0, function* () {
                const lastCreatedActiveOrder = yield ordersStore.getCurrentOrder(1);
                // console.log(lastCreatedActiveOrder);
                expect(lastCreatedActiveOrder).toBeDefined();
            }));
            it('getAllOrders() should return list of orders.', () => __awaiter(void 0, void 0, void 0, function* () {
                const allOrders = yield ordersStore.getAllOrders();
                expect(allOrders.length).toBeGreaterThan(0);
            }));
            it('getAllOrdersByUserId() should return list of orders by specific user id', () => __awaiter(void 0, void 0, void 0, function* () {
                const allOrdersByUserId = yield ordersStore.getAllOrdersByUserId(1);
                expect(allOrdersByUserId.length).toEqual(3);
            }));
            it('getAllOrdersByUserId() should return empty list of orders if user id does not exist.', () => __awaiter(void 0, void 0, void 0, function* () {
                const allOrdersByUserId = yield ordersStore.getAllOrdersByUserId(10000);
                expect(allOrdersByUserId.length).toEqual(0);
            }));
            it('getAllSpecificStatusOrdersByUserId() should return list with length of 2. Status = active', () => __awaiter(void 0, void 0, void 0, function* () {
                const allProductsBySpecificStatus = yield ordersStore.getAllSpecificStatusOrdersByUserId(1, 'active');
                expect(allProductsBySpecificStatus.length).toEqual(2);
            }));
            it('getAllSpecificStatusOrdersByUserId() should return list with length of 1. Status = complete', () => __awaiter(void 0, void 0, void 0, function* () {
                const allProductsBySpecificStatus = yield ordersStore.getAllSpecificStatusOrdersByUserId(1, 'complete');
                expect(allProductsBySpecificStatus.length).toEqual(1);
            }));
            it('getCurrentOrder() should return null.', () => __awaiter(void 0, void 0, void 0, function* () {
                const lastCreatedActiveOrder = yield ordersStore.getCurrentOrder(25);
                expect(lastCreatedActiveOrder).toBe(null);
            }));
            it('createOrder() should create order for specific user. Return order.', () => __awaiter(void 0, void 0, void 0, function* () {
                const newOrder = {
                    user_id: 2,
                    status: 'active',
                };
                const createdOrder = yield ordersStore.createOrder(newOrder);
                expect(createdOrder.id).toEqual(34);
            }));
            it('completeOrder() should complete order for specific user', () => __awaiter(void 0, void 0, void 0, function* () {
                const completeOrder = yield ordersStore.completeOrder(2, 2, 'complete');
                expect({
                    id: completeOrder === null || completeOrder === void 0 ? void 0 : completeOrder.id,
                    user_id: completeOrder === null || completeOrder === void 0 ? void 0 : completeOrder.user_id,
                    status: completeOrder === null || completeOrder === void 0 ? void 0 : completeOrder.status,
                }).toEqual({
                    id: 2,
                    user_id: 2,
                    status: 'complete',
                });
            }));
            it('completeOrder() should return null if there is no order for specific user', () => __awaiter(void 0, void 0, void 0, function* () {
                const completeOrder = yield ordersStore.completeOrder(100000, 100000, 'complete');
                expect(completeOrder).toBe(null);
            }));
        });
        describe('Testing products-in-orders', () => {
            it('getAllProductInOrders() should return list of products-in-orders', () => __awaiter(void 0, void 0, void 0, function* () {
                const getAllProductInOrders = yield productsInOrder.getAllProductInOrders();
                expect(getAllProductInOrders.length).toBeGreaterThan(0);
            }));
            it('createProductsInOrders() should return newly created products-in-orders if success.', () => __awaiter(void 0, void 0, void 0, function* () {
                const createdProductInOrder = yield productsInOrder.createProductsInOrders(productInOrderNotExist);
                expect(createdProductInOrder).toEqual({
                    id: 38,
                    quantity: 5,
                    product_id: 10,
                    order_id: 10,
                });
            }));
            it('createProductsInOrders() should return SQL ERROR when products-in-orders already exist.', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield productsInOrder.createProductsInOrders(productInOrderAlreadyExist);
                }
                catch (err) {
                    expect(err instanceof Error).toBe(true);
                }
            }));
        });
        describe('Testing dashboard: ', () => {
            it('mostPopularProducts() should have length of 5 elements, and first element is: { name: "Coffee", total_quantity: 20}', () => __awaiter(void 0, void 0, void 0, function* () {
                const popularProducts = yield dashboardQuery.mostPopularProducts();
                expect(popularProducts.length).toEqual(5);
                expect(Object.assign(Object.assign({}, popularProducts[0]), { total_quantity: Number(popularProducts[0].total_quantity) })).toEqual({ name: 'Coffee', total_quantity: 20 });
            }));
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsInOrder.deleteAllProductInOrders();
        yield ordersStore.deleteAllOrders();
        yield productsStore.deleteAllProducts();
        yield usersStore.deleteAllUsers();
    }));
}));
