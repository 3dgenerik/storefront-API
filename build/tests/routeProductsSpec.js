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
const constants_1 = require("../constants");
const request = (0, supertest_1.default)(app_1.default);
describe('Testing products routes: ', () => {
    const productsStore = new productsStore_1.ProductsStore();
    const productAlreadyExist = {
        name: 'Laptop',
        price: 799.99,
        category: 'electronics',
    };
    const productNotExist = {
        name: 'Cintiq',
        price: 2569.99,
        category: 'electronics',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsStore.createRandomProducts();
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */} should return status code 200 and product length must be greater than 0.`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}`);
        const products = result.body;
        expect(products.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/category/clothing should return status code 200 and product length must be greater than 0.`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/category/clothing`);
        const products = result.body;
        expect(products.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    }));
    it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/category/vehicles should return status code 404. Error message: 'Products not found'.`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}/category/vehicles`);
        expect(result.text).toEqual('Products not found.');
        expect(result.status).toBe(404);
    }));
    it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */} should return status 200 and product: { id: 36, name: 'Cintiq', price: 2569.99, category: 'electronics' } [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request
            .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}`)
            .set('Authorization', `Bearer ${constants_1.token}`)
            .send(productNotExist);
        const createdProduct = (yield result.body);
        expect(Object.assign(Object.assign({}, createdProduct), { price: Number(createdProduct.price) })).toEqual({
            id: 36,
            name: 'Cintiq',
            price: 2569.99,
            category: 'electronics',
        });
        expect(result.status).toBe(200);
    }));
    it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */} should return status 409. Error message: Product ${productAlreadyExist.name} in category: ${productAlreadyExist.category} already exist. [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request
            .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}`)
            .set('Authorization', `Bearer ${constants_1.token}`)
            .send(productAlreadyExist);
        expect(result.text).toEqual(`Product ${productAlreadyExist.name} in category: ${productAlreadyExist.category} already exist.`);
        expect(result.status).toBe(409);
    }));
    it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */} testing body validation middleware and should return status 400. Error message: Bad request. Invalid values: price, category. Please provide correct values. [TOKEN REQUIRED]' }`, () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request
            .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/products" /* AppRoutePath.ENDPOINT_PRODUCTS */}`)
            .set('Authorization', `Bearer ${constants_1.token}`)
            .send({ name: 'Laptop' });
        expect(result.text).toEqual(`Bad request. Invalid values: price, category. Please provide correct values.`);
        expect(result.status).toBe(400);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield productsStore.deleteAllProducts();
    }));
});
