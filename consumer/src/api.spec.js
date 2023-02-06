import API from "./api";
import nock from "nock";

describe("API", () => {

    // test("get all products", async () => {
    //     const products = [
    //         {
    //             "id": "9",
    //             "type": "CREDIT_CARD",
    //             "name": "GEM Visa",
    //             "version": "v2"
    //         },
    //         {
    //             "id": "10",
    //             "type": "CREDIT_CARD",
    //             "name": "28 Degrees",
    //             "version": "v1"
    //         }
    //     ];
    //     nock(API.url)
    //         .get('/products')
    //         .reply(200,
    //             products,
    //             {'Access-Control-Allow-Origin': '*'});
    //     const respProducts = await API.getAllProducts();
    //     expect(respProducts).toEqual(products);
    // });

    // test("get product ID 50", async () => {
    //     const product = {
    //         "id": "50",
    //         "type": "CREDIT_CARD",
    //         "name": "28 Degrees",
    //         "version": "v1"
    //     };
    //     nock(API.url)
    //         .get('/products/50')
    //         .reply(200, product, {'Access-Control-Allow-Origin': '*'});
    //     const respProduct = await API.getProduct("50");
    //     expect(respProduct).toEqual(product);
    // });

    [
        { 
            email: 'soar.authenticated@nhatest.com', 
            userId: 'dcadecea-ecb6-4d94-b509-fb9f2e9f59fc', 
            hotelId: 208497600, 
            contactName: 'SOARTest Authenticated' 
        },
    ].forEach(
        testCase => test(`create product owner ${testCase.userId}`, async () => {
  
        const requestBody = {
            contactName: testCase.contactName,
            emailAddress : testCase.email,
            userId: testCase.userId,
            dmcId : 332,
            hotelId : 0,
            languageId : 0,
            countryId : 0,
        };

        const responseBody = {
            contactName: testCase.contactName,
            countryId: 0,
            dmcId: 332,
            emailAddress : testCase.email,
            firstName: testCase.contactName.split(' ')[0],
            hotelId: testCase.hotelId,
            languageId: 0,
            lastName: testCase.contactName.split(' ')[1],
            phoneNumber: "",
            userId: testCase.userId,
        };
        nock(API.url)
            .post('/v1/property/owner')
            .matchHeader('Content-Type', 'application/vnd.api+json')
            .matchHeader('accept', 'application/vnd.api+json')
            .reply(200,
                responseBody,
                {
                    // 'Content-Type': 'application/vnd.api+json',
                    // 'accept': 'application/vnd.api+json',
                    'Access-Control-Allow-Origin': '*'
                });
        const resp = await API.createPropertyOwner(requestBody);
        expect(resp).toEqual(responseBody);
    }));
});
