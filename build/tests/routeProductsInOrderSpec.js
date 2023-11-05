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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const productsStore_1 = require("../models/productsStore");
const ordersStore_1 = require("../models/ordersStore");
const productsInOrder_1 = require("../models/productsInOrder");
const usersStore_1 = require("../models/usersStore");
const constants_1 = require("../constants");
const request = (0, supertest_1.default)(app_1.default);
describe('Testing product-in-orders routes: ', () => {
    const usersStore = new usersStore_1.UsersStore();
    const productsStore = new productsStore_1.ProductsStore();
    const ordersStore = new ordersStore_1.OrdersStore();
    const productsInOrder = new productsInOrder_1.ProductsInOrder();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAnProductInOrder = (obj) => {
        return 'quantity' in obj && 'product_id' in obj && 'order_id' in obj;
    };
    const uniqueProductInOrder = {
        quantity: 1,
        product_id: 6,
        order_id: 6,
    };
    const nonUniqueProductInOrder = {
        quantity: 3,
        product_id: 1,
        order_id: 1,
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersStore.createRandomUsers();
        yield productsStore.createRandomProducts();
        yield ordersStore.createRandomOrders();
        yield productsInOrder.createRandomProductInOrders();
    }));
    describe('Testin create product-in-orders: ', () => {
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create should return status code 200, check if created product-in-otder is IProductInOrder. Also return created user as object [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create`)
                .set('Authorization', `Bearer ${constants_1.token}`)
                .send(uniqueProductInOrder);
            const createdProductInOrder = (yield result.body);
            expect(isAnProductInOrder(createdProductInOrder)).toBe(true);
            expect(createdProductInOrder).toEqual({
                id: 38,
                quantity: 1,
                product_id: 6,
                order_id: 6,
            });
            expect(result.status).toBe(200);
        }));
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create should return status code 422 and return empty object [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create`)
                .set('Authorization', `Bearer ${constants_1.token}`)
                .send(nonUniqueProductInOrder);
            const possiblyCreatedProductInOrder = (yield result.body);
            expect(possiblyCreatedProductInOrder.id).toBe(undefined);
            expect(result.status).toEqual(422);
        }));
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create testing body validator and should return status code 400. Error message: Bad request. Invalid values: quantity, product_id, order_id. Please provide correct values. [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create`)
                .set('Authorization', `Bearer ${constants_1.token}`)
                .send({});
            expect(result.text).toEqual('Bad request. Invalid values: quantity, product_id, order_id. Please provide correct values.');
            expect(result.status).toEqual(400);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsInOrder.deleteAllProductInOrders();
        yield ordersStore.deleteAllOrders();
        yield productsStore.deleteAllProducts();
        yield usersStore.deleteAllUsers();
    }));
});
