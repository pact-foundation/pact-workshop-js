import path from "path";
import {Pact} from "@pact-foundation/pact";
import {API} from "./api";
import {eachLike, like} from "@pact-foundation/pact/dsl/matchers";

const provider = new Pact({
    consumer: 'FrontendWebsite',
    provider: 'ProductService',
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    logLevel: "warn",
    dir: path.resolve(process.cwd(), 'pacts'),
    spec: 2
});

describe("API Pact test", () => {

    beforeAll(() => {
        return provider.setup();
    });

    afterEach(async () => {
        await provider.verify();
    });

    afterAll(async () => {
        return provider.finalize();
    });

    describe("getting all products", () => {
        test("products exists", async () => {

            // set up Pact interactions
            await provider.addInteraction({
                state: 'products exist',
                uponReceiving: 'get all products',
                withRequest: {
                    method: 'GET',
                    path: '/products'
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: eachLike({
                        id: "09",
                        type: "CREDIT_CARD",
                        name: "Gem Visa"
                    }),
                },
            });

            const api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            const product = await api.getAllProducts();

            expect(product).toStrictEqual([
                {"id": "09", "name": "Gem Visa", "type": "CREDIT_CARD"}
            ]);
        });

        test("no products exists", async () => {

            // set up Pact interactions
            await provider.addInteraction({
                state: 'no products exist',
                uponReceiving: 'get all products',
                withRequest: {
                    method: 'GET',
                    path: '/products'
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: []
                },
            });

            const api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            const product = await api.getAllProducts();

            expect(product).toStrictEqual([]);
        });
    });

    describe("getting one product", () => {
        test("ID 10 exists", async () => {

            // set up Pact interactions
            await provider.addInteraction({
                state: 'product with ID 10 exists',
                uponReceiving: 'get product with ID 10',
                withRequest: {
                    method: 'GET',
                    path: '/product/10'
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: like({
                        id: "10",
                        type: "CREDIT_CARD",
                        name: "28 Degrees"
                    }),
                },
            });

            const api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            const product = await api.getProduct("10");

            expect(product).toStrictEqual({
                id: "10",
                type: "CREDIT_CARD",
                name: "28 Degrees"
            });
        });

        test("product does not exist", async () => {

            // set up Pact interactions
            await provider.addInteraction({
                state: 'product with ID 11 does not exist',
                uponReceiving: 'get product with ID 11',
                withRequest: {
                    method: 'GET',
                    path: '/product/11'
                },
                willRespondWith: {
                    status: 404
                },
            });

            const api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            await expect(api.getProduct("11")).rejects.toThrow("Request failed with status code 404");
        });
    });
});