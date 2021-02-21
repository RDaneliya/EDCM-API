const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const root = require('../../src/graphql/root');
const chai = require('chai');
const util = require('util');

const url = 'http://localhost:3000/';
const request = require('supertest')(url);

const schema = loadSchemaSync(path.join(__dirname, '../../src/graphql/schemas/schema.graphql'), {
  loaders: [new GraphQLFileLoader()]
});

const query =
  {
    query: `{
      staion(stationName: 'Sovica') {
        stationName;
        systemName;
        commodities;
        {
          name;
          buyPrice;
          sellPrice;
          stock;
          demand;
        }
      }
    }`
  };

// eslint-disable-next-line no-undef
jest.mock('../../src/graphql/root', () => {
  return {
    station: {
      stationName: 'TestStation',
      systemName: 'TestSystem',
      commodities: [
        {
          name: 'TestCommodity',
          buyPrice: 1337,
          sellPrice: 14,
          stock: 37,
          demand: 88
        }
      ]
    }
  };
});

// eslint-disable-next-line no-undef
describe('GraphQL', () => {
  // eslint-disable-next-line no-undef
  it('Returns station info with commodities', (done) => {
    request.post('/graphql')
      .send(query)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});

