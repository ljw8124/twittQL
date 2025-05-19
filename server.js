import {ApolloServer, gql} from "apollo-server";

// graphql 의  schema definition language
const typeDefs = gql`
    type Query {
        text: String
    }
`;

const server = new ApolloServer({typeDefs});

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})