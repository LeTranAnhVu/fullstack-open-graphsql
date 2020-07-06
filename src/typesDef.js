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
  
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    accessToken: String!
  }
  type Genre {
    genre : String!
  }
  
   type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!,
    genres: [Genre!]!
    me: User
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    
    editAuthor(
    name: String!
    setBornTo: Int!
    ): Author
    
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
  }
`



module.exports = {
  bookTypeDefs
}