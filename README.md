# Pact JS workshop

## Introduction

This workshop is aimed at demonstrating core features and benefits of contract testing with Pact.

Whilst contract testing can be applied retrospectively to systems, we will follow the [consumer driven contracts](https://martinfowler.com/articles/consumerDrivenContracts.html) approach in this workshop - where a new consumer and provider are created in parallel to evolve a service over time, especially where there is some uncertainty with what is to be built.

This workshop should take from 1 to 2 hours, depending on how deep you want to go into each topic.

**Workshop outline**:

- [step 1: **create consumer**](https://github.com/pact-foundation/pact-workshop-js/tree/step1#step-1---simple-consumer-calling-provider): Create our consumer before the Provider API even exists
- [step 2: **unit test**](https://github.com/pact-foundation/pact-workshop-js/tree/step2#step-2---client-tested-but-integration-fails): Write a unit test for our consumer
- [step 3: **pact test**](https://github.com/pact-foundation/pact-workshop-js/tree/step3#step-3---pact-to-the-rescue): Write a Pact test for our consumer
- [step 4: **pact verification**](https://github.com/pact-foundation/pact-workshop-js/tree/step4#step-4---verify-the-provider): Verify the consumer pact with the Provider API
- [step 5: **fix consumer**](https://github.com/pact-foundation/pact-workshop-js/tree/step5#step-5---back-to-the-client-we-go): Fix the consumer's bad assumptions about the Provider
- [step 6: **pact test**](https://github.com/pact-foundation/pact-workshop-js/tree/step6#step-6---consumer-updates-contract-for-missing-products): Write a pact test for `404` (missing User) in consumer
- [step 7: **provider states**](https://github.com/pact-foundation/pact-workshop-js/tree/step7#step-7---adding-the-missing-states): Update API to handle `404` case
- [step 8: **pact test**](https://github.com/pact-foundation/pact-workshop-js/tree/step8#step-8---authorization): Write a pact test for the `401` case
- [step 9: **pact test**](https://github.com/pact-foundation/pact-workshop-js/tree/step9#step-9---implement-authorisation-on-the-provider): Update API to handle `401` case
- [step 10: **request filters**](https://github.com/pact-foundation/pact-workshop-js/tree/step10#step-10---request-filters-on-the-provider): Fix the provider to support the `401` case
- [step 11: **pact broker**](https://github.com/pact-foundation/pact-workshop-js/tree/step11#step-11---using-a-pact-broker): Implement a broker workflow for integration with CI/CD
- [step 12: **broker webhooks**](https://github.com/pact-foundation/pact-workshop-js/tree/step12#step-12---using-webhooks): Trigger provider workflows when contracts change, via webhooks
- [step 13: **pactflow broker**](https://github.com/pact-foundation/pact-workshop-js/tree/step13#step-13---using-a-pactflow-broker): Implement a managed pactflow workflow for integration with CI/CD

_NOTE: Each step is tied to, and must be run within, a git branch, allowing you to progress through each stage incrementally. For example, to move to step 2 run the following: `git checkout step2`_

## Learning objectives

If running this as a team workshop format, you may want to take a look through the [learning objectives](./LEARNING.md).

## Requirements

[Docker](https://www.docker.com)

[Docker Compose](https://docs.docker.com/compose/install/)

[Node + NPM](https://nodejs.org/en/)

## Scenario

There are two components in scope for our workshop.

1. Product Catalog website. It provides an interface to query the Product service for product information.
1. Product Service (Provider). Provides useful things about products, such as listing all products and getting the details of an individual product.

## Step 1 - Simple Consumer calling Provider

We need to first create an HTTP client to make the calls to our provider service:

![Simple Consumer](diagrams/workshop_step1.svg)

The Consumer has implemented the product service client which has the following:

- `GET /products` - Retrieve all products
- `GET /products/{id}` - Retrieve a single product by ID

The diagram below highlights the interaction for retrieving a product with ID 10:

![Sequence Diagram](diagrams/workshop_step1_class-sequence-diagram.svg)

You can see the client interface we created in `consumer/src/api.js`:

```javascript
export class API {

    constructor(url) {
        if (url === undefined || url === "") {
            url = process.env.REACT_APP_API_BASE_URL;
        }
        if (url.endsWith("/")) {
            url = url.substr(0, url.length - 1)
        }
        this.url = url
    }

    withPath(path) {
        if (!path.startsWith("/")) {
            path = "/" + path
        }
        return `${this.url}${path}`
    }

    async getAllProducts() {
        return axios.get(this.withPath("/products"))
            .then(r => r.data);
    }

    async getProduct(id) {
        return axios.get(this.withPath("/products/" + id))
            .then(r => r.data);
    }
}
```

After forking or cloning the repository, we may want to install the dependencies `npm install`.
We can run the client with `npm start --prefix consumer` - it should fail with the error below, because the Provider is not running.

![Failed step1 page](diagrams/workshop_step1_failed_page.png)

*Move on to [step 2](https://github.com/pact-foundation/pact-workshop-js/tree/step2#step-2---client-tested-but-integration-fails)*

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

  Local:            http://127.0.0.1:3000/
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

## Step 3 - Pact to the rescue

Unit tests are written and executed in isolation of any other services. When we write tests for code that talk to other services, they are built on trust that the contracts are upheld. There is no way to validate that the consumer and provider can communicate correctly.

> An integration contract test is a test at the boundary of an external service verifying that it meets the contract expected by a consuming service — [Martin Fowler](https://martinfowler.com/bliki/IntegrationContractTest.html)

Adding contract tests via Pact would have highlighted the `/product/{id}` endpoint was incorrect.

Let us add Pact to the project and write a consumer pact test for the `GET /products/{id}` endpoint.

*Provider states* is an important concept of Pact that we need to introduce. These states help define the state that the provider should be in for specific interactions. For the moment, we will initially be testing the following states:

- `product with ID 10 exists`
- `products exist`

The consumer can define the state of an interaction using the `given` property.

Note how similar it looks to our unit test:

In `consumer/src/api.pact.spec.js`:

```javascript
import path from "path";
import { PactV3, MatchersV3, SpecificationVersion, } from "@pact-foundation/pact";
import { API } from "./api";
const { eachLike, like } = MatchersV3;

const provider = new PactV3({
  consumer: "FrontendWebsite",
  provider: "ProductService",
  log: path.resolve(process.cwd(), "logs", "pact.log"),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), "pacts"),
  spec: SpecificationVersion.SPECIFICATION_VERSION_V2,
  host: "127.0.0.1"
});

describe("API Pact test", () => {
  describe("getting all products", () => {
    test("products exists", async () => {
      // set up Pact interactions
      await provider.addInteraction({
        states: [{ description: "products exist" }],
        uponReceiving: "get all products",
        withRequest: {
          method: "GET",
          path: "/products",
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: eachLike({
            id: "09",
            type: "CREDIT_CARD",
            name: "Gem Visa",
          }),
        },
      });

      await provider.executeTest(async (mockService) => {
        const api = new API(mockService.url);

        // make request to Pact mock server
        const product = await api.getAllProducts();

        expect(product).toStrictEqual([
          { id: "09", name: "Gem Visa", type: "CREDIT_CARD" },
        ]);
      });
    });
  });

  describe("getting one product", () => {
    test("ID 10 exists", async () => {
      // set up Pact interactions
      await provider.addInteraction({
        states: [{ description: "product with ID 10 exists" }],
        uponReceiving: "get product with ID 10",
        withRequest: {
          method: "GET",
          path: "/products/10",
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: like({
            id: "10",
            type: "CREDIT_CARD",
            name: "28 Degrees",
          }),
        },
      });

      await provider.executeTest(async (mockService) => {
        const api = new API(mockService.url);

        // make request to Pact mock server
        const product = await api.getProduct("10");

        expect(product).toStrictEqual({
          id: "10",
          type: "CREDIT_CARD",
          name: "28 Degrees",
        });
      });
    });
  });
});
```


![Test using Pact](diagrams/workshop_step3_pact.svg)

This test starts a mock server a random port that acts as our provider service. To get this to work we update the URL in the `Client` that we create, after initialising Pact.

To simplify running the tests, add this to `consumer/package.json`:

```javascript
// add it under scripts
"test:pact": "cross-env CI=true react-scripts test --testTimeout 30000 pact.spec.js",
```

Running this test still passes, but it creates a pact file which we can use to validate our assumptions on the provider side, and have conversation around.

```console
❯ npm run test:pact --prefix consumer

PASS src/api.spec.js
PASS src/api.pact.spec.js

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        2.792s, estimated 3s
Ran all test suites.
```

A pact file should have been generated in *consumer/pacts/FrontendWebsite-ProductService.json*

*NOTE*: even if the API client had been graciously provided for us by our Provider Team, it doesn't mean that we shouldn't write contract tests - because the version of the client we have may not always be in sync with the deployed API - and also because we will write tests on the output appropriate to our specific needs.

*Move on to [step 4](https://github.com/pact-foundation/pact-workshop-js/tree/step4#step-4---verify-the-provider)*

## Step 4 - Verify the provider

We need to make the pact file (the contract) that was produced from the consumer test available to the Provider module. This will help us verify that the provider can meet the requirements as set out in the contract. For now, we'll hard code the path to where it is saved in the consumer test, in step 11 we investigate a better way of doing this.

Now let's make a start on writing Pact tests to validate the consumer contract:

In `provider/product/product.pact.test.js`:

```javascript
const { Verifier } = require('@pact-foundation/pact');
const path = require('path');

// Setup provider server to verify
const app = require('express')();
app.use(require('./product.routes'));
const server = app.listen("8080");

describe("Pact Verification", () => {
    it("validates the expectations of ProductService", () => {
        const opts = {
            logLevel: "INFO",
            providerBaseUrl: "http://127.0.0.1:8080",
            provider: "ProductService",
            providerVersion: "1.0.0",
            pactUrls: [
                path.resolve(__dirname, '../../consumer/pacts/FrontendWebsite-ProductService.json')
            ]
        };

        return new Verifier(opts).verifyProvider().then(output => {
            console.log(output);
        }).finally(() => {
            server.close();
        });
    })
});
```

To simplify running the tests, add this to `provider/package.json`:

```javascript
// add it under scripts
"test:pact": "npx jest --testTimeout=30000 --testMatch \"**/*.pact.test.js\""
```

We now need to validate the pact generated by the consumer is valid, by executing it against the running service provider, which should fail:

```console
❯ npm run test:pact --prefix provider

Verifying a pact between FrontendWebsite and ProductService

  get product with ID 10
    returns a response which
      has status code 200 (FAILED)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (FAILED)
      has a matching body (FAILED)

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)


Failures:

1) Verifying a pact between FrontendWebsite and ProductService Given product with ID 10 exists - get product with ID 10
    1.1) has a matching body
           expected 'application/json;charset=utf-8' body but was 'text/html;charset=utf-8'
    1.2) has status code 200
           expected 200 but was 404
    1.3) includes header 'Content-Type' with value 'application/json; charset=utf-8'
           Expected header 'Content-Type' to have value 'application/json; charset=utf-8' but was 'text/html; charset=utf-8'
```

![Pact Verification](diagrams/workshop_step4_pact.svg)

The test has failed, as the expected path `/products/{id}` is returning 404. We incorrectly believed our provider was following a RESTful design, but the authors were too lazy to implement a better routing solution 🤷🏻‍♂️.

The correct endpoint which the consumer should call is `/product/{id}`.

Move on to [step 5](https://github.com/pact-foundation/pact-workshop-js/tree/step5#step-5---back-to-the-client-we-go)

## Step 5 - Back to the client we go

We now need to update the consumer client and tests to hit the correct product path.

First, we need to update the GET route for the client:

In `consumer/src/api.js`:

```javascript
async getProduct(id) {
  return axios.get(this.withPath("/product/" + id))
  .then(r => r.data);
}
```

Then we need to update the Pact test `ID 10 exists` to use the correct endpoint in `path`.

In `consumer/src/api.pact.spec.js`:

```javascript
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

...
```

![Pact Verification](diagrams/workshop_step5_pact.svg)

Let's run and generate an updated pact file on the client:

```console
❯ npm run test:pact --prefix consumer

PASS src/api.pact.spec.js
  API Pact test
    getting all products
      ✓ products exists (18ms)
    getting one product
      ✓ ID 10 exists (8ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.106s
Ran all test suites matching /pact.spec.js/i.
```



Now we run the provider tests again with the updated contract:

Run the command:

```console
❯ npm run test:pact --prefix provider

Verifying a pact between FrontendWebsite and ProductService

  get product with ID 10
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)
```

Yay - green ✅!

Move on to [step 6](https://github.com/pact-foundation/pact-workshop-js/tree/step6#step-6---consumer-updates-contract-for-missing-products)

## Step 6 - Consumer updates contract for missing products

We're now going to add 2 more scenarios for the contract

- What happens when we make a call for a product that doesn't exist? We assume we'll get a `404`.

- What happens when we make a call for getting all products but none exist at the moment? We assume a `200` with an empty array.

Let's write a test for these scenarios, and then generate an updated pact file.

In `consumer/src/api.pact.spec.js`:

```javascript
// within the 'getting all products' group
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

// within the 'getting one product' group
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

  await provider.executeTest(async (mockService) => {
    const api = new API(mockService.url);

    // make request to Pact mock server
    await expect(api.getProduct("11")).rejects.toThrow(
    "Request failed with status code 404"
    );
  });
});
```

Notice that our new tests look almost identical to our previous tests, and only differ on the expectations of the _response_ - the HTTP request expectations are exactly the same.

```console
❯ npm run test:pact --prefix consumer

PASS src/api.pact.spec.js
  API Pact test
    getting all products
      ✓ products exists (24ms)
      ✓ no products exists (13ms)
    getting one product
      ✓ ID 10 exists (14ms)
      ✓ product does not exist (14ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        2.437s, estimated 3s
Ran all test suites matching /pact.spec.js/i.

```

What does our provider have to say about this new test:

```console
❯ npm run test:pact --prefix provider

Verifying a pact between FrontendWebsite and ProductService

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (FAILED)

  get product with ID 10
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product with ID 11
    returns a response which
      has status code 404 (FAILED)
      has a matching body (OK)

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)


Failures:

1) Verifying a pact between FrontendWebsite and ProductService Given no products exist - get all products
    1.1) has a matching body
           $ -> Expected an empty List but received [{"id":"09","name":"Gem Visa","type":"CREDIT_CARD","version":"v1"},{"id":"10","name":"28 Degrees","type":"CREDIT_CARD","version":"v1"},{"id":"11","name":"MyFlexiPay","type":"PERSONAL_LOAN","version":"v2"}]
2) Verifying a pact between FrontendWebsite and ProductService Given product with ID 11 does not exist - get product with ID 11
    2.1) has status code 404
           expected 404 but was 200
```

We expected this failure, because the product we are requesing does in fact exist! What we want to test for, is what happens if there is a different *state* on the Provider. This is what is referred to as "Provider states", and how Pact gets around test ordering and related issues.

We could resolve this by updating our consumer test to use a known non-existent product, but it's worth understanding how Provider states work more generally.

*Move on to [step 7](https://github.com/pact-foundation/pact-workshop-js/tree/step7#step-7---adding-the-missing-states)*

## Step 7 - Adding the missing states

Our code already deals with missing users and sends a `404` response, however our test data fixture always has product ID 10 and 11 in our database.

In this step, we will add a state handler (`stateHandlers`) to our provider Pact verifications, which will update the state of our data store depending on which states the consumers require.

States are invoked prior to the actual test function is invoked. You can see the full [lifecycle here](https://github.com/pact-foundation/pact-go#lifecycle-of-a-provider-verification).

We're going to add handlers for all our states:

- products exist
- no products exist
- product with ID 10 exists
- product with ID 11 does not exist

Let's open up our provider Pact verifications in `provider/product/product.pact.test.js`:

```javascript
// add this to the Verifier opts
stateHandlers: {
  "product with ID 10 exists": () => {
    controller.repository.products = new Map([
      ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")]
    ]);
  },
  "products exist": () => {
    controller.repository.products = new Map([
      ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
      ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")]
    ]);
  },
  "no products exist": () => {
    controller.repository.products = new Map();
  },
  "product with ID 11 does not exist": () => {
    controller.repository.products = new Map();
  },
}
```

Let's see how we go now:

```console
❯ npm run test:pact --prefix provider

Verifying a pact between FrontendWebsite and ProductService

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product with ID 10
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product with ID 11
    returns a response which
      has status code 404 (OK)
      has a matching body (OK)

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)
```

_NOTE_: The states are not necessarily a 1 to 1 mapping with the consumer contract tests. You can reuse states amongst different tests. In this scenario we could have used `no products exist` for both tests which would have equally been valid.

*Move on to [step 8](https://github.com/pact-foundation/pact-workshop-js/tree/step8#step-8---authorization)*

## Step 8 - Authorization

It turns out that not everyone should be able to use the API. After a discussion with the team, it was decided that a time-bound bearer token would suffice. The token must be in `yyyy-MM-ddTHHmm` format and within 1 hour of the current time.

In the case a valid bearer token is not provided, we expect a `401`. Let's update the consumer to pass the bearer token, and capture this new `401` scenario.

In `consumer/src/api.js`:

```javascript
    generateAuthToken() {
        return "Bearer " + new Date().toISOString()
    }

    async getAllProducts() {
        return axios.get(this.withPath("/products"), {
            headers: {
                "Authorization": this.generateAuthToken()
            }
        })
            .then(r => r.data);
    }

    async getProduct(id) {
        return axios.get(this.withPath("/product/" + id), {
            headers: {
                "Authorization": this.generateAuthToken()
            }
        })
            .then(r => r.data);
    }
```

In `consumer/src/api.pact.spec.js` we add authentication headers to the request setup for the existing tests:

```js
      await provider.addInteraction({
        states: [{ description: "no products exist" }],
        uponReceiving: "get all products",
        withRequest: {
          method: "GET",
          path: "/products",
          headers: {
            Authorization: like("Bearer 2019-01-14T11:34:18.045Z"),
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: [],
        },
      });
```

and we also add two new tests for the "no auth token" use case:

```js
    // ...
    test("no auth token", async () => {

      // set up Pact interactions
      await provider.addInteraction({
        states: [{ description: "product with ID 10 exists" }],
        uponReceiving: "get product by ID 10 with no auth token",
        withRequest: {
          method: "GET",
          path: "/product/10",
        },
        willRespondWith: {
          status: 401,
        },
      });

      await provider.executeTest(async (mockService) => {
        const api = new API(mockService.url);

        // make request to Pact mock server
        await expect(api.getProduct("10")).rejects.toThrow(
          "Request failed with status code 401"
        );
      });
    });
```

Generate a new Pact file:

```console
❯ npm run test:pact --prefix consumer

PASS src/api.pact.spec.js
  API Pact test
    getting all products
      ✓ products exists (23ms)
      ✓ no products exists (13ms)
      ✓ no auth token (14ms)
    getting one product
      ✓ ID 10 exists (12ms)
      ✓ product does not exist (12ms)
      ✓ no auth token (14ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.469s, estimated 3s
Ran all test suites matching /pact.spec.js/i.
```

We should now have two new interactions in our pact file.

Let's test the provider:

```console
❯ npm run test:pact --prefix provider

Verifying a pact between FrontendWebsite and ProductService

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product by ID 10 with no auth token
    returns a response which
      has status code 401 (FAILED)
      has a matching body (OK)

  get product with ID 10
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product with ID 11
    returns a response which
      has status code 404 (OK)
      has a matching body (OK)

  get all products
    returns a response which
      has status code 401 (FAILED)
      has a matching body (OK)


Failures:

1) Verifying a pact between FrontendWebsite and ProductService Given product with ID 10 exists - get product by ID 10 with no auth token
    1.1) has status code 401
           expected 401 but was 200
2) Verifying a pact between FrontendWebsite and ProductService Given products exist - get all products
    2.1) has status code 401
           expected 401 but was 200
```

Now with the most recently added interactions where we are expecting a response of 401 when no authorization header is sent, we are getting 200...

Move on to [step 9](https://github.com/pact-foundation/pact-workshop-js/tree/step9#step-9---implement-authorisation-on-the-provider)*

## Step 9 - Implement authorisation on the provider

We will add a middleware to check the Authorization header and deny the request with `401` if the token is older than 1 hour.

In `provider/middleware/auth.middleware.js`

```javascript
// 'Token' should be a valid ISO 8601 timestamp within the last hour
const isValidAuthTimestamp = (timestamp) => {
    let diff = (new Date() - new Date(timestamp)) / 1000;
    return diff >= 0 && diff <= 3600
};

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const timestamp = req.headers.authorization.replace("Bearer ", "")
    if (!isValidAuthTimestamp(timestamp)) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

module.exports = authMiddleware;
```

In `provider/server.js`

```javascript
const authMiddleware = require('./middleware/auth.middleware');

// add this into your init function
app.use(authMiddleware);
```

We also need to add the middleware to the server our Pact tests use.

In `provider/product/product.pact.test.js`:

```javascript
const authMiddleware = require('../middleware/auth.middleware');
app.use(authMiddleware);
```

This means that a client must present an HTTP `Authorization` header that looks as follows:

```
Authorization: Bearer 2006-01-02T15:04
```

Let's test this out:

```console
❯ npm run test:pact --prefix provider

Verifying a pact between FrontendWebsite and ProductService

  get all products
    returns a response which
      has status code 200 (FAILED)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (FAILED)

  get product by ID 10 with no auth token
    returns a response which
      has status code 401 (OK)
      has a matching body (OK)

  get product with ID 10
    returns a response which
      has status code 200 (FAILED)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (FAILED)

  get product with ID 11
    returns a response which
      has status code 404 (FAILED)
      has a matching body (OK)

  get all products
    returns a response which
      has status code 401 (OK)
      has a matching body (OK)


Failures:

1) Verifying a pact between FrontendWebsite and ProductService Given no products exist - get all products
    1.1) has a matching body
           $ -> Type mismatch: Expected List [] but received Map {"error":"Unauthorized"}
    1.2) has status code 200
           expected 200 but was 401
2) Verifying a pact between FrontendWebsite and ProductService Given product with ID 10 exists - get product with ID 10
    2.1) has a matching body
           $ -> Actual map is missing the following keys: id, name, type
    2.2) has status code 200
           expected 200 but was 401
3) Verifying a pact between FrontendWebsite and ProductService Given product with ID 11 does not exist - get product with ID 11
    3.1) has status code 404
           expected 404 but was 401

There were 3 pact failures
```

Oh, dear. _More_ tests are failing. Can you understand why?

*Move on to [step 10](https://github.com/pact-foundation/pact-workshop-js/tree/step10#step-10---request-filters-on-the-provider)*

## Step 10 - Request Filters on the Provider

Because our pact file has static data in it, our bearer token is now out of date, so when Pact verification passes it to the Provider we get a `401`. There are multiple ways to resolve this - mocking or stubbing out the authentication component is a common one. In our use case, we are going to use a process referred to as _Request Filtering_, using a `RequestFilter`.

_NOTE_: This is an advanced concept and should be used carefully, as it has the potential to invalidate a contract by bypassing its constraints. See https://github.com/DiUS/pact-jvm/blob/master/provider/junit/README.md#modifying-the-requests-before-they-are-sent for more details on this.

The approach we are going to take to inject the header is as follows:

1. If we receive any Authorization header, we override the incoming request with a valid (in time) Authorization header, and continue with whatever call was being made
1. If we don't receive an Authorization header, we do nothing

_NOTE_: We are not considering the `403` scenario in this example.

In `provider/product/product.pact.test.js`:

```javascript
// add this to the Verifier opts
requestFilter: (req, res, next) => {
  if (!req.headers["authorization"]) {
    next();
    return;
  }
  req.headers["authorization"] = `Bearer ${ new Date().toISOString() }`;
  next();
},
```

We can now run the Provider tests

```console
❯ npm run test:pact --prefix provider


```

*Move on to [step 11](https://github.com/pact-foundation/pact-workshop-js/tree/step11#step-11---using-a-pact-broker)*

## Step 11 - Using a Pact Broker

![Broker collaboration Workflow](diagrams/workshop_step10_broker.svg)

We've been publishing our pacts from the consumer project by essentially sharing the file system with the provider. But this is not very manageable when you have multiple teams contributing to the code base, and pushing to CI. We can use a [Pact Broker](https://pactflow.io) to do this instead.

Using a broker simplifies the management of pacts and adds a number of useful features, including some safety enhancements for continuous delivery which we'll see shortly.

In this workshop we will be using the open source Pact broker.

### Running the Pact Broker with docker-compose

In the root directory, run:

```console
docker-compose up
```

### Publish contracts from consumer

First, in the consumer project we need to tell Pact about our broker. We can use the in built `pact-broker` CLI command to do this:

```javascript
// add this under scripts
"pact:publish": "pact-broker publish ./pacts --consumer-app-version=\"1.0.0\" --auto-detect-version-properties --broker-base-url=http://127.0.0.1:8000 --broker-username pact_workshop --broker-password pact_workshop"
```

Now run

```console
❯ npm run test:pact --prefix consumer

PASS src/api.pact.spec.js
  API Pact test
    getting all products
      ✓ products exists (22ms)
      ✓ no products exists (12ms)
      ✓ no auth token (13ms)
    getting one product
      ✓ ID 10 exists (11ms)
      ✓ product does not exist (12ms)
      ✓ no auth token (14ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        2.653s
Ran all test suites matching /pact.spec.js/i.
```

To publish the pacts:


```
❯ npm run pact:publish --prefix consumer

Created FrontendWebsite version 24c0e1-step11+24c0e1.SNAPSHOT.SB-AS-G7GM9F7 with branch step11
Pact successfully published for FrontendWebsite version 24c0e1-step11+24c0e1.SNAPSHOT.SB-AS-G7GM9F7 and provider ProductService.
  View the published pact at http://127.0.0.1:8000/pacts/provider/ProductService/consumer/FrontendWebsite/version/24c0e1-step11%2B24c0e1.SNAPSHOT.SB-AS-G7GM9F7
  Events detected: contract_published (pact content is the same as previous versions with tags  and no new tags were applied)
  Next steps:
    * Configure separate ProductService pact verification build and webhook to trigger it when the pact content changes. See https://docs.pact.io/go/webhooks
```

*NOTE: you would usually only publish pacts from CI. *

Have a browse around the broker on http://127.0.0.1:8000 (with username/password: `pact_workshop`/`pact_workshop`) and see your newly published contract!

### Verify contracts on Provider

All we need to do for the provider is update where it finds its pacts, from local URLs, to one from a broker.

In `provider/product/product.pact.test.js`:

```javascript
//replace
pactUrls: [
  path.resolve(__dirname, '../pacts/FrontendWebsite-ProductService.json')
],

// with
pactBrokerUrl: process.env.PACT_BROKER_BASE_URL || "http://127.0.0.1:8000",
pactBrokerUsername: process.env.PACT_BROKER_USERNAME || "pact_workshop",
pactBrokerPassword: process.env.PACT_BROKER_PASSWORD || "pact_workshop",
```

```javascript
// add to the opts {...}
publishVerificationResult: process.env.CI || process.env.PACT_BROKER_PUBLISH_VERIFICATION_RESULTS
```

Let's run the provider verification one last time after this change. It should print a few notices showing which pact(s) it has found from the broker, and why they were selected:

```console
❯ PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true npm run test:pact --prefix provider

The pact at http://127.0.0.1:8000/pacts/provider/ProductService/consumer/FrontendWebsite/pact-version/80d8e7379fc7d5cfe503665ec1776bfb139aa8cf is being verified because the pact content belongs to the consumer version matching the following criterion:
    * latest version of FrontendWebsite that has a pact with ProductService (9cd950-step10+9cd950.SNAPSHOT.SB-AS-G7GM9F7)

Verifying a pact between FrontendWebsite and ProductService

  get all products
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product by ID 10 with no auth token
    returns a response which
      has status code 401 (OK)
      has a matching body (OK)

  get product with ID 10
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)

  get product with ID 11
    returns a response which
      has status code 404 (OK)
      has a matching body (OK)

  get all products
    returns a response which
      has status code 401 (OK)
      has a matching body (OK)
```

As part of this process, the results of the verification - the outcome (boolean) and the detailed information about the failures at the interaction level - are published to the Broker also.

This is one of the Broker's more powerful features. Referred to as [Verifications](https://docs.pact.io/pact_broker/advanced_topics/provider_verification_results), it allows providers to report back the status of a verification to the broker. You'll get a quick view of the status of each consumer and provider on a nice dashboard. But, it is much more important than this!

### Can I deploy?

With just a simple use of the `pact-broker` [can-i-deploy tool](https://docs.pact.io/pact_broker/advanced_topics/provider_verification_results) - the Broker will determine if a consumer or provider is safe to release to the specified environment.

You can run the `pact-broker can-i-deploy` checks as follows:

```console
❯ npx pact-broker can-i-deploy \
               --pacticipant FrontendWebsite \
               --broker-base-url http://127.0.0.1:8000 \
               --broker-username pact_workshop \
               --broker-password pact_workshop \
               --latest

Computer says yes \o/

CONSUMER        | C.VERSION | PROVIDER       | P.VERSION | SUCCESS?
----------------|-----------|----------------|-----------|---------
FrontendWebsite | fe0b6a3   | ProductService | 1.0.0     | true

All required verification results are published and successful

----------------------------

❯ npx pact-broker can-i-deploy \
                --pacticipant ProductService \
                --broker-base-url http://127.0.0.1:8000 \
                --broker-username pact_workshop \
                --broker-password pact_workshop \
                --latest

Computer says yes \o/

CONSUMER        | C.VERSION | PROVIDER       | P.VERSION | SUCCESS?
----------------|-----------|----------------|-----------|---------
FrontendWebsite | fe0b6a3   | ProductService | 1.0.0     | true

All required verification results are published and successful
```

That's it - you're now a Pact pro. Go build 🔨

If you have extra time, why not try out Pact Webhooks

*Move on to [step 12](https://github.com/pact-foundation/pact-workshop-js/tree/step12#step-12---using-webhooks)*

## Step 12 - Using Webhooks

**honours course**

When a consumer contract is published, we want to trigger a provider build, in order to verify the contract.

We can simulate this locally and explore the techniques involved.

Start the Pact Broker if its not already running

1. `docker compose up -d`

Start the fake broker webhook service

1. `npm run start --prefix broker-webhook`

```console

> broker-webhook@1.0.0 start
> node server.js

## CI Simulator ## Broker webhook is listening on port 9090...
```

Publish a webhook to our Pact broker

1. `npm run create-webhook --prefix broker-webhook`

```sh
curl http://host.docker.internal:8000/webhooks \
    -X POST --user pact_workshop:pact_workshop \
    -H "Content-Type: application/json" -d @broker-create-body.json -v
```

This will send the following payload.

```json
{
"events": [
  {
    "name": "contract_content_changed"
  }
],
"request": {
  "method": "POST",
  "url": "http://host.docker.internal:9090",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "state": "${pactbroker.githubVerificationStatus}",
    "description": "Pact Verification Tests ${pactbroker.providerVersionTags}",
    "context": "${pactbroker.providerName}",
    "target_url": "${pactbroker.verificationResultUrl}"
  }
}
}
```

```console
> broker-webhook@1.0.0 create-webhook
> ./create_webhook.sh

Note: Unnecessary use of -X or --request, POST is already inferred.
*   Trying 127.0.0.1:8000...
* Connected to localhost (127.0.0.1) port 8000 (#0)
* Server auth using Basic with user 'pact_workshop'
> POST /webhooks HTTP/1.1
> Host: localhost:8000
> Authorization: Basic cGFjdF93b3Jrc2hvcDpwYWN0X3dvcmtzaG9w
> User-Agent: curl/8.1.2
> Accept: */*
> Content-Type: application/json
> Content-Length: 511
> 
< HTTP/1.1 201 Created
< Vary: Accept
< Content-Type: application/hal+json;charset=utf-8
< Location: http://localhost:8000/webhooks/QxdSU5uCDllJTLDS_iLbNg
< Date: Fri, 29 Sep 2023 14:28:43 GMT
< Server: Webmachine-Ruby/2.0.0 Rack/1.3
< X-Pact-Broker-Version: 2.107.1
< X-Content-Type-Options: nosniff
< Content-Length: 926
< 
* Connection #0 to host localhost left intact
{"uuid":"QxdSU5uCDllJTLDS_iLbNg","description":"POST host.docker.internal","enabled":true,"request":{"method":"POST","url":"http://host.docker.internal:9090","headers":{"Content-Type":"application/json"},"body":{"state":"${pactbroker.githubVerificationStatus}","description":"Pact Verification Tests ${pactbroker.providerVersionTags}","context":"${pactbroker.providerName}","target_url":"${pactbroker.verificationResultUrl}"}},"events":[{"name":"contract_content_changed"}],"createdAt":"2023-09-29T14:28:43+00:00","_links":{"self":{"title":"POST host.docker.internal","href":"http://localhost:8000/webhooks/QxdSU5uCDllJTLDS_iLbNg"},"pb:execute":{"title":"Test the execution of the webhook with the latest matching pact or verification by sending a POST request to this URL","href":"http://localhost:8000/webhooks/QxdSU5uCDllJTLDS_iLbNg/execute"},"pb:webhooks":{"title":"All webhooks","href":"http://localhost:8000/webhooks"}}}% 
```

Run the consumer pact tests

1. `npm run test:pact --prefix consumer`

Publish the consumer pact tests

1. `npm run pact:publish --prefix consumer`

```console
> consumer@0.1.0 pact:publish
> pact-broker publish ./pacts --consumer-app-version="1.0.1" --auto-detect-version-properties --broker-base-url=http://127.0.0.1:8000 --broker-username pact_workshop --broker-password pact_workshop

Created FrontendWebsite version 1.0.1 with branch all_steps
Pact successfully published for FrontendWebsite version 1.0.1 and provider ProductService.
  View the published pact at http://127.0.0.1:8000/pacts/provider/ProductService/consumer/FrontendWebsite/version/1.0.1
  Events detected: contract_published, contract_content_changed (first time untagged pact published)
  Webhook QxdSU5uCDllJTLDS_iLbNg triggered for event contract_content_changed.
    View logs at http://127.0.0.1:8000/triggered-webhooks/f8299b7a-53c4-4f5f-b4a8-7f87dbee1bdf/logs
  Next steps:
    * Add Pact verification tests to the ProductService build. See https://docs.pact.io/go/provider_verification
```

This will trigger the provider tests.

```console
## CI Simulator ## Broker webhook is listening on port 9090...
Got webhook {"state":"pending","description":"Pact Verification Tests ","context":"ProductService","target_url":""} 
 Triggering provider tests...
provider-verification: 
> product-service@1.0.0 test:pact
> jest --testTimeout 30000 --testMatch "**/*.pact.test.js"
```

*Optional - Move on to [step 13](https://github.com/pact-foundation/pact-workshop-js/tree/step13#step-13---using-a-pactflow-broker)* for integrating with a PactFlow Broker