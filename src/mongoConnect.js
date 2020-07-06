const mongoose = require('mongoose')
const {MONGODB_URI} = require('./utils/config')

const initialize = async () => {
  try {
    mongoose.set('useFindAndModify', false)
    mongoose.set('useCreateIndex', true)
    await mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connecting to MongoDB:', error.message)
  }
}

module.exports = {
  initialize
}