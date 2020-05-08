import { ApolloServer, gql } from 'apollo-server';
import dotenv from "dotenv";
import { makeExecutableSchema } from "graphql-tools";
import { IsAuthenticatedDirective, HasRoleDirective, HasScopeDirective } from "graphql-auth-user-directives";

dotenv.config();

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    directive @hasScope(scopes: [String]) on OBJECT | FIELD_DEFINITION
    directive @hasRole(roles: [Role]) on OBJECT | FIELD_DEFINITION
    directive @isAuthenticated on OBJECT | FIELD_DEFINITION

    enum Role {
        visitor
        admin
    }
    
    # This "Book" type defines the queryable fields for every book in our data source.
    type Book {
        title: String,
        addedBy: String
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
    
    type Mutation {
        addBook(title: String): Book
    }
`;

let books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        addedBy: 'Peter'
    },
    {
        title: 'Jurassic Park',
        addedBy: 'Nathan'
    },
];

let authors = [
    {
        name: 'J.K. Rowling'
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
    Mutation: {
        addBook: (object, params, ctx, resolveInfo) => {
            const newBook = {title: params.title};
            books.push(newBook);
            return newBook;
        }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
        isAuthenticated: IsAuthenticatedDirective,
        hasRole: HasRoleDirective,
        hasScope: HasScopeDirective
    }
});

const server = new ApolloServer({ schema });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});