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
const ordersStore_1 = require("../models/ordersStore");
const productsInOrder_1 = require("../models/productsInOrder");
const productsStore_1 = require("../models/productsStore");
const usersStore_1 = require("../models/usersStore");
const request = (0, supertest_1.default)(app_1.default);
describe('Testing routes: ', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozLCJmaXJzdF9uYW1lIjoiS2F0YXJpbmEiLCJsYXN0X25hbWUiOiJQb3BvdmljIiwicGFzc3dvcmQiOiIkMmIkMTAkbE5ONGoua3RiUWxFQ3ZKOTlDL3pGTzFEcGdxRGtkTWRSTGNSREZ5eUlKbTBmRmhucm5ySmUifSwiaWF0IjoxNjk5MTAwNTY5fQ.J7TNKFUN1b61BcOKop3yKl9lv8VL3-Jz2Ixr4rpO2Ho';
    describe('Testing user routes: ', () => {
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
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */} getAllusers() should return status 200, users.length > 0 [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}`)
                .set('Authorization', `Bearer ${token}`);
            const users = result.body;
            expect(users.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}  should return status 401 without or wrong token [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}`);
            expect(result.status).toBe(401);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/current should return User object with id = 3 [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/current`)
                .set('Authorization', `Bearer ${token}`);
            const currentUser = (yield result.body);
            expect(currentUser).toEqual({
                id: 3,
                first_name: 'Katarina',
                last_name: 'Popovic',
                password: '$2b$10$lNN4j.ktbQlECvJ99C/zFO1DpgqDkdMdRLcRDFyyIJm0fFhnrnrJe',
            });
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/current should return 401 without or wrong token [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/current`);
            expect(result.status).toEqual(401);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1 should return user with id 1, first_name = 'Milena', last_name = 'Petrovic'`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1`)
                .set('Authorization', `Bearer ${token}`);
            const user = result.body;
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
        }));
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield productsInOrder.deleteAllProductInOrders();
            yield ordersStore.deleteAllOrders();
            yield productsStore.deleteAllProducts();
            yield usersStore.deleteAllUsers();
        }));
    });
});
