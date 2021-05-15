import express from 'express';
import path from 'path';
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import {graphqlHTTP} from "express-graphql";
import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import root from './graphql/root.mjs';
import {Sock} from './sock/index.js';


console.log(path.join(path.resolve(''), '../src/graphql/schemas/schema.graphql'));
const schema = loadSchemaSync(path.join(path.resolve(''), '../src/graphql/schemas/schema.graphql'), {
  loaders: [new GraphQLFileLoader()]
});

const app = express();

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

Sock('tcp://eddn.edcd.io', 9500);

export default app;
