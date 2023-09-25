# Pact JS workshop

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
