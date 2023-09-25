# Pact JS workshop

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
