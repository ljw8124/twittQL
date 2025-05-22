import {ApolloServer, gql} from "apollo-server";

// graphql 의  schema definition language
const typeDefs = gql`
    type User {
        id: ID
        username: String
    }
    
    type Tweet {
        id: ID
        text: String
        author: User
    }
    
    # 서버에서 데이터를 요청할 때 (GET)
    type Query {
        allTweets: [Tweet]
        tweet(id: ID): Tweet
    }
    
    # 사용자가 데이터를 서버에 보내고 싶을 때는 Mutation 을 사용한다 (POST)
    type Mutation {
        postTweet(text: String, userId: ID): Tweet
        deleteTweet(id: ID): Boolean
    }
`;

const server = new ApolloServer({typeDefs});

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})