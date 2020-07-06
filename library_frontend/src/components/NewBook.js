import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import {CREATE_BOOK} from '../graphql/graphql'

const NewBook = ({show}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [errorMessage, setErrorMessage ] = useState()

  const [createBook] = useMutation(CREATE_BOOK, {
    onError: (errors) => {
      setErrorMessage('cannot log error with error.graphQLErrors[0].message')
    }
  })

  if (!show) {
    return null
  }


  const submit = async (event) => {
    event.preventDefault()
    await createBook({variables: {title, author, published: parseInt(published), genres}})
    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook