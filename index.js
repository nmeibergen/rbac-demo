const { ApolloServer, gql } = require('apollo-server');
import { IsAuthenticatedDirective, HasRoleDirective, HasScopeDirective } from "graphql-auth-user-directives";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    type Book {
        title: String
    }
    
    type Author {
        name: String,
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        books: [Book]
        authors: [Author]
    }
`;

const books = [
    {
        title: 'Harry Potter and the Chamber of Secrets'
    },
    {
        title: 'J.K. Rowling',
    },
];

const authors = [
    {
        name: 'Harry Potter and the Chamber of Secrets'
    },
    {
        name: 'Michael Crichton',
    },
];


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
        authors: () => authors,
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});