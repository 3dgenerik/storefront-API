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
describe('Testing dashboard routes: ', () => {
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
    describe('Testing get most popular products', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/popular should return status code 200, and popular products length = 5. Also sum of all total_quantity = 55`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/popular`);
            const popularProductsList = (yield result.body);
            const totalSum = popularProductsList.reduce((acc, product) => {
                return acc + Number(product.total_quantity);
            }, 0);
            expect(popularProductsList.length).toEqual(5);
            expect(totalSum).toEqual(55);
            expect(result.status).toBe(200);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/popular should return status code 200, and popular products length = 5. Also sum of all total_quantity = 55`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/popular`);
            const popularProductsList = (yield result.body);
            const totalSum = popularProductsList.reduce((acc, product) => {
                return acc + Number(product.total_quantity);
            }, 0);
            expect(popularProductsList.length).toEqual(5);
            expect(totalSum).toEqual(55);
            expect(result.status).toBe(200);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsInOrder.deleteAllProductInOrders();
        yield ordersStore.deleteAllOrders();
        yield productsStore.deleteAllProducts();
        yield usersStore.deleteAllUsers();
    }));
});
