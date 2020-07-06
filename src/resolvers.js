const {UserInputError} = require('apollo-server')
const Book = require('./models/book')
const Author = require('./models/author')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const {author, genre} = args
      if (!author && !genre) {
        return Book.find({}).populate('author').exec()
      }
      return Book.find({genres: {"$in": [genre]}}).populate('author').exec()
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
    }
  },
  Mutation: {
    addBook: async (root, args) => {
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
      const bookError = book.validateSync();
      const authorError = author.validateSync();
      if(authorError) {
        throw new UserInputError(bookError.message, {
          invalidArgs: attrs,
        })
      }
      if(authorError) {
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
    editAuthor: async (root, args) => {
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
    }
  }
}

module.exports = resolvers