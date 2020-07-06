  
import React, {useEffect, useState} from 'react'
import {ALL_AUTHORS} from '../graphql/graphql'
import {useQuery} from '@apollo/client'
import EditAuthor from './EditAuthor'

const Authors = ({show}) => {
  const {loading, error, data} = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState()

  useEffect(()=> {
    if(data && data.allAuthors){
      setAuthors(data.allAuthors)
    }

  },[data])

  if (!show) {
    return null
  }

  if(error) {
    return <div>
      <p>error: internal</p>
    </div>
  }
  if(loading) {
    return <p>loading ...</p>
  }
  if(!authors) {
    return <p>loading ...</p>
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <hr/>
      <h2>Update born</h2>
      <EditAuthor authors={authors}/>
    </div>
  )
}

export default Authors
