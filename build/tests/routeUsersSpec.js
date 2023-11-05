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
const constants_1 = require("../constants");
const usersStore_1 = require("../models/usersStore");
const request = (0, supertest_1.default)(app_1.default);
describe('Testing user routes: ', () => {
    const usersStore = new usersStore_1.UsersStore();
    const userNotExist = {
        first_name: 'John',
        last_name: 'Doe',
        password: 'john',
    };
    const userAlreadyExist = {
        first_name: 'Petar',
        last_name: 'Stojanovic',
        password: 'petar',
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersStore.createRandomUsers();
    }));
    describe('Testing all users: ', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */} should return status 200, users.length > 0 [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}`)
                .set('Authorization', `Bearer ${constants_1.token}`);
            const users = result.body;
            expect(users.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}  should return status 401 without or wrong token [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}`);
            expect(result.status).toBe(401);
        }));
    });
    describe('Testing current user: ', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/current should return User object with id = 3 [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/current`)
                .set('Authorization', `Bearer ${constants_1.token}`);
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
    });
    describe('Testing user by id', () => {
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1 should return user with id 1, first_name = 'Milena', last_name = 'Petrovic'  [TOKEN REQUIRED]`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1`)
                .set('Authorization', `Bearer ${constants_1.token}`);
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
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1000000 should return status code 404. Error message 'User with id 1000000 not found.  [TOKEN REQUIRED]'`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1000000`)
                .set('Authorization', `Bearer ${constants_1.token}`);
            expect(result.text).toEqual('User with id 1000000 not found.');
            expect(result.status).toEqual(404);
        }));
        it(`GET: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1 should return status code 401 with missing or wrong token. [TOKEN REQUIRED]'`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request.get(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/1`);
            expect(result.status).toEqual(401);
        }));
    });
    describe('Testing signup user', () => {
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signup should be first_name: 'John', last_name: 'Doe' with status code 201`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signup`)
                .send(userNotExist);
            const body = result.body;
            const createdUser = body.output.user;
            expect({
                first_name: createdUser.first_name,
                last_name: createdUser.last_name,
            }).toEqual({ first_name: 'John', last_name: 'Doe' });
            expect(result.status).toBe(201);
        }));
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signup should be status code 409 when user already exist. Error message: 'User ${userAlreadyExist.first_name} ${userAlreadyExist.last_name} already exist.'`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signup`)
                .send(userAlreadyExist);
            expect(result.text).toEqual(`User ${userAlreadyExist.first_name} ${userAlreadyExist.last_name} already exist.`);
            expect(result.status).toBe(409);
        }));
    });
    describe('Testing auth user: ', () => {
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signin should be first_name: 'Petar', last_name: 'Stojanovic' with status code 200`, () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signin`)
                .send(userAlreadyExist);
            const body = result.body;
            const authUser = body.output.user;
            expect(Object.assign(Object.assign({}, authUser), { password: typeof authUser.password })).toEqual({
                id: 8,
                first_name: 'Petar',
                last_name: 'Stojanovic',
                password: 'string',
            });
            expect(result.status).toBe(200);
        }));
        it(`POST: ${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signin should be status code 404 when user not found. Error message: 'User not found. Please provide correct first name, last name and password'`, () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = {
                first_name: 'John',
                last_name: 'Fogerty',
                password: 'john',
            };
            const result = yield request
                .post(`${"/api" /* AppRoutePath.PREFIX_ROUTE */}${"/users" /* AppRoutePath.ENDPOINT_USERS */}/signin`)
                .send(newUser);
            expect(result.text).toEqual('User not found. Please provide correct first name, last name and password');
            expect(result.status).toBe(404);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersStore.deleteAllUsers();
    }));
});
