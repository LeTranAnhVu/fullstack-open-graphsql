import React, {useEffect, useState} from 'react'
import {ALL_BOOKS} from '../graphql/graphql'
import {useQuery} from '@apollo/client'

const Books = ({show}) => {
  const {loading, error, data} = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState()

  useEffect(()=> {
    if(data && data.allBooks){
      setBooks(data.allBooks)
    }

  },[data])

  if (!show) {
    return null
  }

  if(error) {
    return <div>
      <p>error: Internal error</p>
    </div>
  }
  if(loading) {
    return <p>loading ...</p>
  }
  if(!books) {
    return <p>loading ...</p>
  }

  return (
    <div>
      <h2>books</h2>

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