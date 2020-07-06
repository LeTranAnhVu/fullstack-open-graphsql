const {gql} = require('apollo-server')

const bookTypeDefs = gql`
  type Book {
    id: ID!
    title: String! 
    author: Author
    published: String!
    genres: [String!]
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String
      published: Int!
      genres: [String!]!
    ): Book!
    
    editAuthor(
    name: String!
    setBornTo: Int!
    ): Author
  }
`



module.exports = {
  bookTypeDefs
}