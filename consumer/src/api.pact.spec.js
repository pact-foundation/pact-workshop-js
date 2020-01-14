import path from "path";
import {Pact} from "@pact-foundation/pact";
import * as Matchers from "@pact-foundation/pact/dsl/matchers";
import {API} from "./api";

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
                    path: '/products',
                    headers: {
                        "Authorization": Matchers.like("Bearer 2019-01-14T11:34:18.045Z")
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: Matchers.eachLike({
                        id: Matchers.like("09"),
                        type: Matchers.like("CREDIT_CARD"),
                        name: Matchers.like("Gem Visa")
                    }, {min: 2}),
                },
            });

            let api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            let product = await api.getAllProducts();

            expect(product).toStrictEqual([
                {"id": "09", "name": "Gem Visa", "type": "CREDIT_CARD"},
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
                    path: '/products',
                    headers: {
                        "Authorization": Matchers.like("Bearer 2019-01-14T11:34:18.045Z")
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: []
                },
            });

            let api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            let product = await api.getAllProducts();

            expect(product).toStrictEqual([]);
        });

        test("no auth token", async () => {

            // set up Pact interactions
            await provider.addInteraction({
                state: 'products exist',
                uponReceiving: 'get all products with no auth token',
                withRequest: {
                    method: 'GET',
                    path: '/products'
                },
                willRespondWith: {
                    status: 401
                },
            });

            let api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            await expect(api.getAllProducts()).rejects.toThrow("Request failed with status code 401");
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
                    path: '/product/10',
                    headers: {
                        "Authorization": Matchers.like("Bearer 2019-01-14T11:34:18.045Z")
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: {
                        id: Matchers.like("10"),
                        type: Matchers.like("CREDIT_CARD"),
                        name: Matchers.like("28 Degrees")
                    },
                },
            });

            let api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            let product = await api.getProduct("10");

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
                    path: '/product/11',
                    headers: {
                        "Authorization": Matchers.like("Bearer 2019-01-14T11:34:18.045Z")
                    }
                },
                willRespondWith: {
                    status: 404
                },
            });

            let api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            await expect(api.getProduct("11")).rejects.toThrow("Request failed with status code 404");
        });

        test("no auth token", async () => {

            // set up Pact interactions
            await provider.addInteraction({
                state: 'product with ID 10 exists',
                uponReceiving: 'get product by ID 10 with no auth token',
                withRequest: {
                    method: 'GET',
                    path: '/product/10'
                },
                willRespondWith: {
                    status: 401
                },
            });

            let api = new API(provider.mockService.baseUrl);

            // make request to Pact mock server
            await expect(api.getProduct("10")).rejects.toThrow("Request failed with status code 401");
        });
    });
});