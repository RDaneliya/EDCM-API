import express from 'express';
import {loadSchemaSync} from "@graphql-tools/load";
import {GraphQLFileLoader} from "@graphql-tools/graphql-file-loader";
import * as path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
const { graphqlHTTP } = require('express-graphql');
const root = require('./graphql/root');

const schema = loadSchemaSync(path.join(__dirname, './graphql/schemas/schema.graphql'), {
    loaders: [new GraphQLFileLoader()]
})

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
