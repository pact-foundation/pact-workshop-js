# Pact JS workshop

## Step 2 - Client Tested but integration fails

Now lets create a basic test for our API client. We're going to check 2 things:

1. That our client code hits the expected endpoint
1. That the response is marshalled into an object that is usable, with the correct ID

You can see the client interface test we created in `consumer/src/api.spec.js`:

```javascript
import API from "./api";
import nock from "nock";

describe("API", () => {

    test("get all products", async () => {
        const products = [
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
        const respProducts = await API.getAllProducts();
        expect(respProducts).toEqual(products);
    });

    test("get product ID 50", async () => {
        const product = {
            "id": "50",
            "type": "CREDIT_CARD",
            "name": "28 Degrees",
            "version": "v1"
        };
        nock(API.url)
            .get('/products/50')
            .reply(200, product, {'Access-Control-Allow-Origin': '*'});
        const respProduct = await API.getProduct("50");
        expect(respProduct).toEqual(product);
    });
});
```



![Unit Test With Mocked Response](diagrams/workshop_step2_unit_test.svg)



Let's run this test and see it all pass:

```console
❯ npm test --prefix consumer

PASS src/api.spec.js
  API
    ✓ get all products (15ms)
    ✓ get product ID 50 (3ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.03s
Ran all test suites.
```

If you encounter failing tests after running `npm test --prefix consumer`, make sure that the current branch is `step2`.

Meanwhile, our provider team has started building out their API in parallel. Let's run our website against our provider (you'll need two terminals to do this):


```console
# Terminal 1
❯ npm start --prefix provider

Provider API listening on port 8080...
```

```console
# Terminal 2
> npm start --prefix consumer

Compiled successfully!

You can now view pact-workshop-js in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://192.168.20.17:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.
```

You should now see a screen showing 3 different products. There is a `See more!` button which should display detailed product information.

Let's see what happens!

![Failed page](diagrams/workshop_step2_failed_page.png)

Doh! We are getting 404 everytime we try to view detailed product information. On closer inspection, the provider only knows about `/product/{id}` and `/products`.

We need to have a conversation about what the endpoint should be, but first...

*Move on to [step 3](https://github.com/pact-foundation/pact-workshop-js/tree/step3#step-3---pact-to-the-rescue)*

