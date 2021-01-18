// import the gql tagged template function
const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: Int
    }

    type Book {
        _id: ID
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID!
        user: User
    }

    input SaveBookInput {
        _id: ID
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(bookData: SaveBookInput!): User
        removeBook(bookId: String!): User
    }
`;

// export the typeDefs
module.exports = typeDefs;