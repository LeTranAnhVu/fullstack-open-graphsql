import React, {useEffect, useState} from 'react'
import {ALL_BOOKS, ALL_GENRES} from '../graphql/graphql'
import {useLazyQuery, useQuery} from '@apollo/client'
import Genres from './Genres'

const Books = ({show}) => {
  const [getBooks, {error, loading, data}] = useLazyQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])
  const [filterGenre, setFilterGenre] = useState('')

  useEffect(() => {
    if(filterGenre) {
      getBooks({ variables: { genre: filterGenre } })
    }else {
      getBooks()
    }

  },[filterGenre])


  useEffect(() => {
    if (data && data.allBooks) {
      setBooks(data.allBooks)
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
        filterGenre ? <p>in genre <strong>{filterGenre}</strong></p>
          : <p>in <strong>all</strong></p>
      }
      <Genres setFilterGenre={setFilterGenre}/>
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