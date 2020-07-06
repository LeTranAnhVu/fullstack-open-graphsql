import React, {useEffect, useState} from 'react'
import {ALL_BOOKS} from '../graphql/graphql'
import {useQuery} from '@apollo/client'

const Books = ({show}) => {
  const {loading, error, data} = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [filterGenre, setFilterGenre] = useState('')
  const [genres, setGenres] = useState([])

  const byFilterGenre = (bookArr) => {
    if (filterGenre) {
      return bookArr.filter(book => book.genres.includes(filterGenre))
    } else {
      return [...bookArr]
    }
  }
  const extractGenres = (bookArr = []) => {
    let genresObj = bookArr.reduce((o, book) => {
      book.genres.forEach(genre => o[genre] = 1)
      return o
    }, {})

    return Object.keys(genresObj)
  }

  useEffect(() => {
    if (data && data.allBooks) {
      setBooks(byFilterGenre(data.allBooks))
    }
  }, [data,filterGenre])

  useEffect(() => {
    if (data && data.allBooks) {
      setGenres(extractGenres(data.allBooks))
    }
  }, [data])

  if (!show) {
    return null
  }

  if (error) {
    return <div>
      <p>error: Internal error</p>
    </div>
  }
  if (loading) {
    return <p>loading ...</p>
  }
  if (!books) {
    return <p>loading ...</p>
  }

  return (
    <div>
      <h2>books</h2>
      {
        filterGenre && <p>in genre <strong>{filterGenre}</strong></p>
      }
      {
        genres && genres.map(genre => <button key={genre} onClick={() => setFilterGenre(genre)}>{genre}</button>)
      }
      <table>
        <tbody>
        <tr>
          <th></th>
          <th>
            author
          </th>
          <th>
            published
          </th>
        </tr>
        {books.map(a =>
          <tr key={a.title}>
            <td>{a.title}</td>
            <td>{a.author && a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}

export default Books