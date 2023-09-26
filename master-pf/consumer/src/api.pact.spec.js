import { PactV3 } from '@pact-foundation/pact';
import { API } from './api';
import { MatchersV3 } from '@pact-foundation/pact';
import { Product } from './product';
const { eachLike, like } = MatchersV3;
const Pact = PactV3;

const mockProvider = new Pact({
  consumer: 'pactflow-example-consumer',
  provider: process.env.PACT_PROVIDER
    ? process.env.PACT_PROVIDER
    : 'pactflow-example-provider'
});

describe('API Pact test', () => {
  describe('retrieving a product', () => {
    test('ID 10 exists', async () => {
      // Arrange
      const expectedProduct = {
        id: '10',
        type: 'CREDIT_CARD',
        name: '28 Degrees'
      };

      // Uncomment to see this fail
      // const expectedProduct = { id: '10', type: 'CREDIT_CARD', name: '28 Degrees', price: 30.0, newField: 22}

      mockProvider
        .given('a product with ID 10 exists')
        .uponReceiving('a request to get a product')
        .withRequest({
          method: 'GET',
          path: '/product/10',
          headers: {
            Authorization: like('Bearer 2019-01-14T11:34:18.045Z')
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: like(expectedProduct)
        });
      return mockProvider.executeTest(async (mockserver) => {
        // Act
        const api = new API(mockserver.url);
        const product = await api.getProduct('10');

        // Assert - did we get the expected response
        expect(product).toStrictEqual(new Product(expectedProduct));
        return;
      });
    });

    test('product does not exist', async () => {
      // set up Pact interactions

      mockProvider
        .given('a product with ID 11 does not exist')
        .uponReceiving('a request to get a product')
        .withRequest({
          method: 'GET',
          path: '/product/11',
          headers: {
            Authorization: like('Bearer 2019-01-14T11:34:18.045Z')
          }
        })
        .willRespondWith({
          status: 404
        });
      return mockProvider.executeTest(async (mockserver) => {
        const api = new API(mockserver.url);

        // make request to Pact mock server
        await expect(api.getProduct('11')).rejects.toThrow(
          'Request failed with status code 404'
        );
        return;
      });
    });
  });
  describe('retrieving products', () => {
    test('products exists', async () => {
      // set up Pact interactions
      const expectedProduct = {
        id: '10',
        type: 'CREDIT_CARD',
        name: '28 Degrees'
      };

      mockProvider
        .given('products exist')
        .uponReceiving('a request to get all products')
        .withRequest({
          method: 'GET',
          path: '/products',
          headers: {
            Authorization: like('Bearer 2019-01-14T11:34:18.045Z')
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: eachLike(expectedProduct)
        });
      return mockProvider.executeTest(async (mockserver) => {
        const api = new API(mockserver.url);

        // make request to Pact mock server
        const products = await api.getAllProducts();

        // assert that we got the expected response
        expect(products).toStrictEqual([new Product(expectedProduct)]);
        return;
      });
    });
  });
});
