# Pact JS workshop

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
