const { Verifier } = require("@pact-foundation/pact");
const path = require("path");
const controller = require("./product.controller");
const Product = require("./product");

// Setup provider server to verify
const app = require("express")();
const authMiddleware = require("../middleware/auth.middleware");
app.use(authMiddleware);
app.use(require("./product.routes"));
const server = app.listen("8080");

describe("Pact Verification", () => {
  it("validates the expectations of ProductService", () => {
    const opts = {
      logLevel: "INFO",
      providerBaseUrl: "http://127.0.0.1:8080",
      provider: "ProductService",
      providerVersion: "1.0.0",
      pactUrls: [
        path.resolve(
          __dirname,
          "../../consumer/pacts/FrontendWebsite-ProductService.json"
        ),
      ],
      stateHandlers: {
        "product with ID 10 exists": () => {
          controller.repository.products = new Map([
            ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")],
          ]);
        },
        "products exist": () => {
          controller.repository.products = new Map([
            ["09", new Product("09", "CREDIT_CARD", "Gem Visa", "v1")],
            ["10", new Product("10", "CREDIT_CARD", "28 Degrees", "v1")],
          ]);
        },
        "no products exist": () => {
          controller.repository.products = new Map();
        },
        "product with ID 11 does not exist": () => {
          controller.repository.products = new Map();
        },
      },
      requestFilter: (req, res, next) => {
        if (!req.headers["authorization"]) {
          next();
          return;
        }
        req.headers["authorization"] = `Bearer ${new Date().toISOString()}`;
        next();
      },
    };

    return new Verifier(opts)
      .verifyProvider()
      .then((output) => {
        console.log(output);
      })
      .finally(() => {
        server.close();
      });
  });
});
