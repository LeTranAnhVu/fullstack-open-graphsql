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
      <p>errrorrr : reload page might fix problem, I dont know but I found graphql quite unstable</p>
      <p>Error will cause when react code is update or first run</p>
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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books