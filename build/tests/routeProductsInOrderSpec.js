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
    let token = '';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersStore.createRandomUsers();
        yield productsStore.createRandomProducts();
        yield ordersStore.createRandomOrders();
        yield productsInOrder.createRandomProductInOrders();
        token = yield (0, getToken_1.getToken)();
    }));
    describe('Testing create product-in-orders: ', () => {
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create should return status code 200, check if created product-in-otder is IProductInOrder. Also return created user as object [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create`)
                .set('Authorization', `Bearer ${token}`)
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
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create testing body validator and should return status code 400. Error message: Bad request. Invalid values: quantity, product_id, order_id. Please provide correct values. [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield getRequest_1.request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/create`)
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(result.text).toEqual(`Can't sign in. Please provide correct values.`);
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
