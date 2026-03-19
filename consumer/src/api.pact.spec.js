import {
  Pact,
  Matchers,
} from "@pact-foundation/pact";
import { API } from "./api";

const { eachLike, like } = Matchers;

const provider = new Pact({
  consumer: "FrontendWebsite",
  provider: "ProductService",
  logLevel: "warn",
});

describe("API Pact test", () => {
  describe("getting all products", () => {
    test("products exists", async () => {
      await provider
        .addInteraction()
        .given("products exist")
        .uponReceiving("get all products")
        .withRequest("GET", "/products", (builder) => {
          builder.headers({ Authorization: like("Bearer 2019-01-14T11:34:18.045Z") });
        })
        .willRespondWith(200, (builder) => {
          builder.headers({ "Content-Type": "application/json; charset=utf-8" });
          builder.jsonBody(eachLike({
            id: "09",
            type: "CREDIT_CARD",
            name: "Gem Visa",
          }));
        })
        .executeTest(async (mockService) => {
          const api = new API(mockService.url);
          const product = await api.getAllProducts();
          expect(product).toStrictEqual([
            { id: "09", name: "Gem Visa", type: "CREDIT_CARD" },
          ]);
        });
    });

    test("no products exists", async () => {
      await provider
        .addInteraction()
        .given("no products exist")
        .uponReceiving("get all products")
        .withRequest("GET", "/products", (builder) => {
          builder.headers({ Authorization: like("Bearer 2019-01-14T11:34:18.045Z") });
        })
        .willRespondWith(200, (builder) => {
          builder.headers({ "Content-Type": "application/json; charset=utf-8" });
          builder.jsonBody([]);
        })
        .executeTest(async (mockService) => {
          const api = new API(mockService.url);
          const product = await api.getAllProducts();
          expect(product).toStrictEqual([]);
        });
    });

    test("no auth token", async () => {
      await provider
        .addInteraction()
        .given("products exist")
        .uponReceiving("get all products")
        .withRequest("GET", "/products")
        .willRespondWith(401)
        .executeTest(async (mockService) => {
          const api = new API(mockService.url);
          await expect(api.getAllProducts()).rejects.toThrow(
            "Request failed with status code 401"
          );
        });
    });
  });

  describe("getting one product", () => {
    test("ID 10 exists", async () => {
      await provider
        .addInteraction()
        .given("product with ID 10 exists")
        .uponReceiving("get product with ID 10")
        .withRequest("GET", "/product/10", (builder) => {
          builder.headers({ Authorization: like("Bearer 2019-01-14T11:34:18.045Z") });
        })
        .willRespondWith(200, (builder) => {
          builder.headers({ "Content-Type": "application/json; charset=utf-8" });
          builder.jsonBody(like({
            id: "10",
            type: "CREDIT_CARD",
            name: "28 Degrees",
          }));
        })
        .executeTest(async (mockService) => {
          const api = new API(mockService.url);
          const product = await api.getProduct("10");
          expect(product).toStrictEqual({
            id: "10",
            type: "CREDIT_CARD",
            name: "28 Degrees",
          });
        });
    });

    test("product does not exist", async () => {
      await provider
        .addInteraction()
        .given("product with ID 11 does not exist")
        .uponReceiving("get product with ID 11")
        .withRequest("GET", "/product/11", (builder) => {
          builder.headers({ Authorization: like("Bearer 2019-01-14T11:34:18.045Z") });
        })
        .willRespondWith(404)
        .executeTest(async (mockService) => {
          const api = new API(mockService.url);
          await expect(api.getProduct("11")).rejects.toThrow(
            "Request failed with status code 404"
          );
        });
    });

    test("no auth token", async () => {
      await provider
        .addInteraction()
        .given("product with ID 10 exists")
        .uponReceiving("get product by ID 10")
                .withRequest("GET", "/product/10", (builder) => {
          builder.headers({ Authorization: like("Bearer 2019-01-14T11:34:18.045Z") });
        })
        .willRespondWith(401)
        .executeTest(async (mockService) => {
          const api = new API(mockService.url);
          await expect(api.getProduct("10")).rejects.toThrow(
            "Request failed with status code 401"
          );
        });
    });
  });
});
