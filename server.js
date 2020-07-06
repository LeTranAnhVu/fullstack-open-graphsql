const {ApolloServer} = require('apollo-server')
const {bookTypeDefs} = require('./src/typesDef')
const {resolvers, context} = require('./src/resolvers')
const mongoConnection = require('./src/mongoConnect')

// connect database
mongoConnection.initialize()

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

const server = new ApolloServer({
  typeDefs: [bookTypeDefs],
  resolvers,
  cors: corsOptions,
  context: context
})

server.listen().then(({url}) => {
  console.log(`Server ready at $ {url}`)
})