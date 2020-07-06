const { UserInputError } = require('apollo-server')
const Book = require('./models/book')
const Author = require('./models/author')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const {author, genre} = args
      if (!author && !genre){
        return Book.find({})
      }
      return books.filter(b => (author ? b.author === author : true) && (genre ? b.genres.includes(genre) : true))
    },
    allAuthors: async () => {
      return Author.find({})
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({ ...args })
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return book
    },
    // editAuthor: (root, args) => {
    //   const {name, setBornTo} = args
    //   const foundAuthor = authors.find(author => author.name === name)
    //   if (!foundAuthor) return null
    //   foundAuthor.born = setBornTo
    //   authors = authors.map(a => a.name === foundAuthor.name ? foundAuthor : a)
    //   return foundAuthor
    // }
  }
}

module.exports = resolvers