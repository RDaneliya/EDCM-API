require('console-stamp')(console);
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const {graphqlHTTP} = require('express-graphql');
const {loadSchemaSync} = require('@graphql-tools/load');
const {GraphQLFileLoader} = require('@graphql-tools/graphql-file-loader');
const root = require('./graphql/root')
require('./sock')('tcp://eddn.edcd.io', 9500);

const schema = loadSchemaSync(path.join(__dirname, './graphql/schemas/schema.graphql'), {
  loaders: [new GraphQLFileLoader()]
});

const app = express();

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

module.exports = app;
