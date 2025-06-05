import {ApolloServer, gql} from "apollo-server";

const tweets = [
    {
        id: "1",
        text: "Hello~",
    },
    {
        id: "2",
        text: "test message",
    }
];

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
        allTweets: [Tweet]! # ! 의 의미는 nullable 이 아니라는 의미, 배열 안에 타입을 넣음으로서 무엇으로 이루어있는지 알려줌
        tweet(id: ID): Tweet
    }

    # 사용자가 데이터를 서버에 보내고 싶을 때는 Mutation 을 사용한다 (POST)
    # 서버에 보내고 DB에 반영
    type Mutation {
        postTweet(text: String, userId: ID): Tweet
        deleteTweet(id: ID): Boolean
    }
    # 즉 Mutation 을 이용해서 POST, Query 를 이용하여 GET
`;

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        // resolvers 의 첫 번째 파라미터는 root
        tweet(root, {id}) {
            return tweets.find(tweet => tweet.id === id);
        }
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            };
            tweets.push(newTweet);

            return newTweet;
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})