import { ProductsStore } from '../models/productsStore';
import { AppRoutePath } from '../constants';
import { IProduct } from '../interface';
import { request } from './utils/getRequest';
import { getToken } from './utils/getToken';
import { UsersStore } from '../models/usersStore';

describe('Testing products routes: ', () => {
    const usersStore = new UsersStore();
    const productsStore = new ProductsStore();

    const productAlreadyExist: IProduct = {
        name: 'Laptop',
        price: 799.99,
        category: 'electronics',
    };

    const productNotExist: IProduct = {
        name: 'Cintiq',
        price: 2569.99,
        category: 'electronics',
    };

    let token = '';

    beforeAll(async () => {
        await usersStore.createRandomUsers();
        await productsStore.createRandomProducts();
        token = await getToken();
    });

    it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS} should return status code 200 and product length must be greater than 0.`, async () => {
        const result = await request.get(
            `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}`,
        );
        const products = result.body;
        expect(products.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    });

    it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/category/clothing should return status code 200 and product length must be greater than 0.`, async () => {
        const result = await request.get(
            `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/category/clothing`,
        );
        const products = result.body;
        expect(products.length).toBeGreaterThan(0);
        expect(result.status).toBe(200);
    });

    it(`GET: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/category/vehicles should return status code 404. Error message: 'Products not found'.`, async () => {
        const result = await request.get(
            `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}/category/vehicles`,
        );
        expect(result.text).toEqual('Products not found.');
        expect(result.status).toBe(404);
    });

    it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS} should return status 200 and product: { id: 36, name: 'Cintiq', price: 2569.99, category: 'electronics' } [TOKEN REQUIRED]`, async () => {
        const result = await request
            .post(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}`,
            )
            .set('Authorization', `Bearer ${token}`)
            .send(productNotExist);
        const createdProduct = (await result.body) as IProduct;
        expect({
            ...createdProduct,
            price: Number(createdProduct.price),
        }).toEqual({
            id: 36,
            name: 'Cintiq',
            price: 2569.99,
            category: 'electronics',
        });
        expect(result.status).toBe(200);
    });

    it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS} should return status 409. Error message: Product ${productAlreadyExist.name} in category: ${productAlreadyExist.category} already exist. [TOKEN REQUIRED]`, async () => {
        const result = await request
            .post(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}`,
            )
            .set('Authorization', `Bearer ${token}`)
            .send(productAlreadyExist);
        expect(result.text).toEqual(
            `Product ${productAlreadyExist.name} in category: ${productAlreadyExist.category} already exist.`,
        );
        expect(result.status).toBe(409);
    });

    it(`POST: ${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS} testing body validation middleware and should return status 400. Error message: Bad request. Invalid values: price, category. Please provide correct values. [TOKEN REQUIRED]' }`, async () => {
        const result = await request
            .post(
                `${AppRoutePath.PREFIX_ROUTE}${AppRoutePath.ENDPOINT_PRODUCTS}`,
            )
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Laptop' });
        expect(result.text).toEqual(
            `Bad request. Invalid values: price, category. Please provide correct values.`,
        );
        expect(result.status).toBe(400);
    });

    afterAll(async () => {
        await productsStore.deleteAllProducts();
        await usersStore.deleteAllUsers();
    });
});
