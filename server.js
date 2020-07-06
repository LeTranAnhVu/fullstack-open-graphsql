const {ApolloServer, gql} = require('apollo-server')
const {v1: uuid} = require('uuid')
let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['Agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'Revolution']
  },
]

const typeDefs = gql`
  type Book {
    title: String! 
    author: String!
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
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    
    editAuthor(
    name: String!
    setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      const {author, genre} = args
      if (!author && !genre) return books
      return books.filter(b => (author ? b.author === author : true) && (genre ? b.genres.includes(genre) : true))
    },
    allAuthors: () => {
      const booksByAuthor = books.reduce((acc, book) => {
        acc[book.author] = !acc[book.author] ? 1 : acc[book.author] + 1
        return acc
      }, {})
      return authors.map(author => {
        return {
          ...author,
          bookCount: booksByAuthor[author.name] || 0
        }
      })
    }
  },
  Mutation:  {
    addBook: (root, args) => {
      const {author: authorName} = args
      // find the author
      let authorObj = authors.find(a => a.name === authorName)
      if(!authorObj) {
        const authorId = uuid()
        authorObj = {
          name: authorName,
          // born: null,
          id: authorId
        }
        authors = [...authors, authorObj]
      }
      // create book
      const bookId = uuid()
      const newBook = {...args, id: bookId}
      books = [...books, newBook]
      return newBook
    },
    editAuthor: (root, args) => {
      const {name, setBornTo} = args
      const foundAuthor = authors.find(author => author.name === name)
      if(!foundAuthor) return null
      foundAuthor.born = setBornTo
      authors = authors.map(a => a.name === foundAuthor.name ? foundAuthor : a)
      return foundAuthor
    }
  }
}

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: corsOptions
})

server.listen().then(({url}) => {
  console.log(`Server ready at $ {url}`)
})