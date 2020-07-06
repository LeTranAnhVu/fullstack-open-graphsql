import { gql  } from '@apollo/client'

export const ALL_AUTHORS = gql`
query AllAuthor { 
   allAuthors {
    name
    born
    bookCount
  }
}
`


export const ALL_BOOKS = gql`
query AllBooks { 
   allBooks {
    title
    author
    published
  }
}
`
//
// export const CREATE_PERSON = gql`
//   mutation createPerson($name: String!, $street: String!, $city: String!, $phone: String) {
//     // ...
//   }
// `
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
    author
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