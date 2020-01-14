import API from "./api";
import nock from "nock";

describe("API", () => {

    test("get all products", async () => {
        let products = [
            {
                "id": "9",
                "type": "CREDIT_CARD",
                "name": "GEM Visa",
                "version": "v2"
            },
            {
                "id": "10",
                "type": "CREDIT_CARD",
                "name": "28 Degrees",
                "version": "v1"
            }
        ];
        nock(API.url)
            .get('/products')
            .reply(200,
                products,
                {'Access-Control-Allow-Origin': '*'});
        let respProducts = await API.getAllProducts();
        expect(respProducts).toEqual(products);
    });

    test("get product ID 50", async () => {
        let product = {
            "id": "50",
            "type": "CREDIT_CARD",
            "name": "28 Degrees",
            "version": "v1"
        };
        nock(API.url)
            .get('/products/50')
            .reply(200, product, {'Access-Control-Allow-Origin': '*'});
        let respProduct = await API.getProduct("50");
        expect(respProduct).toEqual(product);
    });
});
