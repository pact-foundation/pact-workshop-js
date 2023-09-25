# Pact JS workshop

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
"test:pact": "CI=true react-scripts test --testTimeout 30000 pact.spec.js",
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

A pact file should have been generated in *consumer/pacts/frontendwebsite-productservice.json*

*NOTE*: even if the API client had been graciously provided for us by our Provider Team, it doesn't mean that we shouldn't write contract tests - because the version of the client we have may not always be in sync with the deployed API - and also because we will write tests on the output appropriate to our specific needs.

*Move on to [step 4](https://github.com/pact-foundation/pact-workshop-js/tree/step4#step-4---verify-the-provider)*
