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
const request = (0, supertest_1.default)(app_1.default);
describe('Testing orders routes: ', () => {
    const usersStore = new usersStore_1.UsersStore();
    const productsStore = new productsStore_1.ProductsStore();
    const ordersStore = new ordersStore_1.OrdersStore();
    const productsInOrder = new productsInOrder_1.ProductsInOrder();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersStore.createRandomUsers();
        yield productsStore.createRandomProducts();
        yield ordersStore.createRandomOrders();
        yield productsInOrder.createRandomProductInOrders();
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */} should return status code 200 and order list length greater than 0.`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}`);
        const allOrdersByUser = result.body;
        expect(allOrdersByUser.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/30${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */} should return status code 200. Error message: Orders list is empty.`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/30${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}`);
        expect(result.text).toEqual('Orders list is empty.');
        expect(result.status).toBe(200);
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/notANumber${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */} should return status code 400. Error message: Bad request. Invalid params for userId. Id param(s) must be positive integer number.`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/notANumber${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}`);
        expect(result.text).toEqual('Bad request. Invalid params for userId. Id param(s) must be positive integer number.');
        expect(result.status).toBe(400);
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status?status=active should return status code 200 and get orders length greather than 0`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1${"/orders" /* AppRoutePath.ENDPOINT_ORDERS */}/status?status=active`);
        const allOrdersByUser = result.body;
        expect(allOrdersByUser.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsInOrder.deleteAllProductInOrders();
        yield ordersStore.deleteAllOrders();
        yield productsStore.deleteAllProducts();
        yield usersStore.deleteAllUsers();
    }));
});
