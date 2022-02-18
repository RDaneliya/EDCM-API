import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import {graphqlHTTP} from 'express-graphql';
import {loadSchemaSync} from '@graphql-tools/load';
import {GraphQLFileLoader} from '@graphql-tools/graphql-file-loader';
import root from './graphql/root.mjs';
import {Sock} from './sock/index.mjs';
import path from 'path';


let currentPath = decodeURI(import.meta.url)
    .replace(/^file:\/\//, '');

if (currentPath.match(/^\\[a-zA-Z]:/gmi) || currentPath.match(/^\/[a-zA-Z]:/gmi)) {
  currentPath = currentPath.substring(1);
}

const graphqlSchemaPath = path.join(currentPath, '../graphql/schemas/schema.graphql');


const schema = loadSchemaSync(graphqlSchemaPath, {
  loaders: [new GraphQLFileLoader()]
});

const app = express();

app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

Sock('tcp://eddn.edcd.io', 9500);

export default app;
