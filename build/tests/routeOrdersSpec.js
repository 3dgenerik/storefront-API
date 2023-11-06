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
const productsStore_1 = require("../models/productsStore");
const ordersStore_1 = require("../models/ordersStore");
const productsInOrder_1 = require("../models/productsInOrder");
const usersStore_1 = require("../models/usersStore");
const getRequest_1 = require("./utils/getRequest");
const getToken_1 = require("./utils/getToken");
fdescribe('Testing orders routes: ', () => {
    const usersStore = new usersStore_1.UsersStore();
    const productsStore = new productsStore_1.ProductsStore();
    const ordersStore = new ordersStore_1.OrdersStore();
    const productsInOrder = new productsInOrder_1.ProductsInOrder();
    let token = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAnOrder = (obj) => {
        return 'user_id' in obj && 'status' in obj;
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersStore.createRandomUsers();
        yield productsStore.createRandomProducts();
        yield ordersStore.createRandomOrders();
        yield productsInOrder.createRandomProductInOrders();
        token = yield (0, getToken_1.getToken)();
    }));
    describe('Testing all orders by specific user id:', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */} should return status code 200 and order list length greater than 0.`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}`);
            const allOrdersByUser = result.body;
            expect(allOrdersByUser.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/30${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */} should return status code 200. Error message: Orders list is empty.`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/30${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}`);
            expect(result.text).toEqual('Orders list is empty.');
            expect(result.status).toBe(200);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/notANumber${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */} should return status code 400. Error message: Bad request. Invalid params for userId. Id param(s) must be positive integer number.`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/notANumber${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}`);
            expect(result.text).toEqual('Bad request. Invalid params for userId. Id param(s) must be positive integer number.');
            expect(result.status).toBe(400);
        }));
    });
    describe('Testing orders where status is active by specific user id: ', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status?status=active should return status code 200 and get orders length greater than 0`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status?status=active`);
            const allOrdersByUser = result.body;
            expect(allOrdersByUser.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status?status=active should return status code 200. Error message: Orders list with status active is empty.`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/100${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status?status=active`);
            expect(result.text).toEqual('Orders list with status active is empty.');
            expect(result.status).toBe(200);
        }));
    });
    describe('Testing current (last created) orders by user id: ', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/2${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/current should return status code 200 and current order { id: 2, user_id: 2, status: 'active'} [TOKEN REQUIRED].`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/2${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/current`)
                .set('Authorization', `Bearer ${token}`);
            const currentOrder = (yield result.body);
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
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/10000${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/current should return status code 404. Error message: Current order not found. [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/10000${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/current`)
                .set('Authorization', `Bearer ${token}`);
            expect(result.text).toEqual('Current order not found.');
            expect(result.status).toBe(404);
        }));
    });
    describe('Testing create order: ', () => {
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/create should return status code 200 and check if added order is IOrder [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const order = {
                user_id: 5,
                status: 'active',
            };
            const result = yield getRequest_1.request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/create`)
                .set('Authorization', `Bearer ${token}`)
                .send(order);
            const addedOrder = result.body;
            expect(isAnOrder(addedOrder)).toBe(true);
            expect(result.status).toEqual(200);
        }));
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/create testing body validation middleware with wrong parameters. Error message:  Bad request. Invalid values: user_id, status. Please provide correct values [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const order = {};
            const result = yield getRequest_1.request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/create`)
                .set('Authorization', `Bearer ${token}`)
                .send(order);
            expect(result.text).toEqual('Bad request. Invalid values: user_id, status. Please provide correct values.');
            expect(result.status).toEqual(400);
        }));
        describe('Testing complete order by specific user id', () => {
            it(`PUT: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/12${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/14 should return status code 200 and check if completed order is IOrder. [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield getRequest_1.request
                    .put(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/12${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/14`)
                    .set('Authorization', `Bearer ${token}`);
                const completedOrder = (yield result.body);
                expect(isAnOrder(completedOrder)).toBe(true);
                expect(result.status).toBe(200);
            }));
            it(`PUT: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/100000${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/100000 should return status code 404: Error message: Bad request. User or order doesn't exist. Can't complete order [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield getRequest_1.request
                    .put(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/100000${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/100000`)
                    .set('Authorization', `Bearer ${token}`);
                expect(result.text).toEqual(`Bad request. User or order doesn't exist. Can't complete order.`);
                expect(result.status).toBe(404);
            }));
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsInOrder.deleteAllProductInOrders();
        yield ordersStore.deleteAllOrders();
        yield productsStore.deleteAllProducts();
        yield usersStore.deleteAllUsers();
    }));
});
