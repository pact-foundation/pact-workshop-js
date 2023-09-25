# Pact JS workshop

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
