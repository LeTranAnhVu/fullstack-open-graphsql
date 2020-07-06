const {UserInputError, AuthenticationError} = require('apollo-server')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'


const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const {author, genre} = args
      if (!author && !genre) {
        return Book.find({}).populate('author').exec()
      }
      return Book.find({genres: {'$in': [genre]}}).populate('author').exec()
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(author => {
        return {
          name: author.name,
          born: author.born,
          bookCount: author.books.length
        }
      })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const {currentUser} = context
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const {author: authorName, ...attrs} = args
      let author = null
      try {
        author = await Author.findOne({name: authorName})
        if (!author) {
          // create new author
          author = new Author({name: authorName})
        }
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      const book = new Book({...attrs})
      book.author = author._id
      author.books = [...author.books, book._id]
      const bookError = book.validateSync()
      const authorError = author.validateSync()
      if (authorError) {
        throw new UserInputError(bookError.message, {
          invalidArgs: attrs,
        })
      }
      if (authorError) {
        throw new UserInputError(authorError.message, {
          invalidArgs: attrs,
        })
      }

      try {
        await book.save()
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: attrs,
        })
      }
      return book
    },
    editAuthor: async (root, args, context) => {
      const {currentUser} = context
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      const {name, setBornTo} = args
      const foundAuthor = await Author.findOne({name})

      if (!foundAuthor) {
        throw new UserInputError('cannot find author name: ' + name, {
          invalidArgs: args,
        })
      }
      foundAuthor.born = setBornTo
      try {
        await foundAuthor.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return foundAuthor
    },
    createUser: async (root, args) => {
      const {username, favoriteGenre} = args
      const user = new User({username: username, favoriteGenre:favoriteGenre})
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})
      if (!user || args.password !== 'password') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {accessToken: jwt.sign(userForToken, JWT_SECRET)}
    }
  }
}

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), JWT_SECRET
    )
    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}

module.exports = {
  resolvers,
  context
}