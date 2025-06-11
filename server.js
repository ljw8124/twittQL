import {ApolloServer, gql} from "apollo-server";
import {fetch} from "node-fetch";

let tweets = [
    {
        id: "1",
        text: "Hello~",
        userId: "2"
    },
    {
        id: "2",
        text: "test message",
        userId: "1"
    }
];

let users = [
    {
        id: "1",
        firstName: "Lee",
        lastName: "Joungwoo"
    },
    {
        id: "2",
        firstName: "Jeong",
        lastName: "Hyeseon"
    }
];

// graphql 의  schema definition language
const typeDefs = gql`
    type User {
        id: ID
        firstName: String!
        lastName: String!
        """
        Is the sum of firstName + lastName
        """
        fullName: String!
    }
    """
    Tweet Object represents a resource for a Tweet
    """
    type Tweet {
        id: ID
        text: String
        author: User
    }

    # 서버에서 데이터를 요청할 때 (GET)
    type Query {
        allUsers: [User]!
        allTweets: [Tweet]! # ! 의 의미는 nullable 이 아니라는 의미, 배열 안에 타입을 넣음으로서 무엇으로 이루어있는지 알려줌
        tweet(id: ID): Tweet
        movie(id: String): Movie
    }
    
    type Movie {
        id: Int!
        url: String!
        summary: String
    }

    # 사용자가 데이터를 서버에 보내고 싶을 때는 Mutation 을 사용한다 (POST)
    # 서버에 보내고 DB에 반영
    type Mutation {
        postTweet(text: String, userId: ID): Tweet
        """
        Deletes a Tweet if fine, else return false
        """
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
        },
        allUsers() {
            console.log("allUser called");
            return users;
        },
        allMovies() {
            return fetch("https://yts.torrentbay.st/api/v2/list_movies.json")
                .then(res => res.json())
                .then(json => json.data.movies)
        },
        movie(_, {id}) {
            return fetch(`https://yts.torrentbay.st/api/v2/movie/movie_id=${id}`)
                .then(res => res.json())
                .then(json => json.data.movie);
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
        },
        deleteTweet(_, {id}) {
            const tweet = tweets.find(tweet => tweet.id === id);

            if(!tweet) return false;

            tweets = tweets.filter(tweet => tweet.id !== id);

            return true;
        }
    },
    User: {
        fullName({firstName, lastName}) {
            return `${firstName} ${lastName}`;
        }
    },
    Tweet: {
        author({userId}) {
            return users.find(user => user.id === userId);
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
})