import {makeExecutableSchema, mergeSchemas} from "graphql-tools";
import {resolvers} from "./resolvers";
import fs from "fs";
import {ApolloServer, gql} from "apollo-server";

const typeDefs = gql`${fs.readFileSync(__dirname.concat('/schema.graphql'), 'utf8')}`;
export const serverSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});
(async () => {
    let port, schema;
    schema = mergeSchemas({
        schemas: [serverSchema],
    });
    port = 4001;
    const server = new ApolloServer({schema: schema});
    server.listen({port: port}).then(({url}) => {
        console.log(`🚀  Server ready at ${url}`);
    });
})();
