import app from "../app";
import supertest from "supertest";
import { ProductsStore } from "../models/productsStore";
import { OrdersStore } from "../models/ordersStore";
import { ProductsInOrder } from "../models/productsInOrder";
import { UsersStore } from "../models/usersStore";
import { AppRoutePath } from "../constants";
import { IOrders } from "../interface";

const request = supertest(app)

describe('Testing orders routes: ', ()=>{
    const usersStore = new UsersStore();
    const productsStore = new ProductsStore();
    const ordersStore = new OrdersStore();
    const productsInOrder = new ProductsInOrder();

    beforeAll(async () => {
        await usersStore.createRandomUsers();
        await productsStore.createRandomProducts();
        await ordersStore.createRandomOrders();
        await productsInOrder.createRandomProductInOrders();
    });

    it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS} should return status code 200 and order list length greater than 0.`, async ()=>{
        const result = await request.get(`${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/1${AppRoutePath.ENDPOINT_ORDERS}`)
        const allOrdersByUser = result.body as IOrders[]
        console.log(allOrdersByUser);
        expect(allOrdersByUser.length).toBeGreaterThan(0)
        expect(result.status).toBe(200)
    })

    it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/30${AppRoutePath.ENDPOINT_ORDERS} should return status code 200. Error message: Orders list is empty.`, async ()=>{
        const result = await request.get(`${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/30${AppRoutePath.ENDPOINT_ORDERS}`)
        expect(result.text).toEqual('Orders list is empty.')
        expect(result.status).toBe(200)
    })

    it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/notANumber${AppRoutePath.ENDPOINT_ORDERS} should return status code 400. Error message: Bad request. Invalid params for userId. Id param(s) must be positive integer number.`, async ()=>{
        const result = await request.get(`${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_USERS}/notANumber${AppRoutePath.ENDPOINT_ORDERS}`)
        expect(result.text).toEqual('Bad request. Invalid params for userId. Id param(s) must be positive integer number.')
        expect(result.status).toBe(400)
    })


    afterAll(async () => {
        await productsInOrder.deleteAllProductInOrders();
        await ordersStore.deleteAllOrders();
        await productsStore.deleteAllProducts();
        await usersStore.deleteAllUsers();
    });
})