import { gql  } from '@apollo/client'

export const ME = gql`
query Me { 
   me {
   username
   favoriteGenre
  }
}
`

export const ALL_AUTHORS = gql`
query AllAuthor { 
   allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_GENRES = gql`
query Genres { 
   genres{
    genre
  }
}
`

export const ALL_BOOKS = gql`
query AllBooks($genre: String) { 
   allBooks(genre: $genre) {
    title
    author{
      name
      born
    }
    genres
    published
  }
}
`
export const CREATE_BOOK = gql`
mutation AddBook(
  $title: String!,
  $author: String!,
  $published: Int!,
  $genres: [String!]!
  ){
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres,
  ) {
    title
    published
    genres
  }
}
`

export const EDIT_AUTHOR = gql`
mutation EditAuthor(
  $name: String!,
  $born: Int!,
  ){
  editAuthor(
    name: $name,
    setBornTo: $born,
  ) {
    name
    born
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      accessToken
    }
  }
`
