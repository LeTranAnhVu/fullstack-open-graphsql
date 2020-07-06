import React, {useEffect, useState} from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import {useApolloClient, useQuery} from '@apollo/client'
import {ME} from './graphql/graphql'
import RecommendedBooks from './components/RecommendedBooks'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const {loading, error, data} = useQuery(ME)
  const [user, setUser] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    // try to check token
    console.log(data)
    if(data && data.me) {
      setUser({username: data.me.username, favoriteGenre: data.me.favoriteGenre})
    }

  }, [data])

  useEffect(() => {
    // try to check token
    const accessToken = localStorage.getItem('accessToken')
    setToken(accessToken)
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }


  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {
          user && user.favoriteGenre && <button onClick={() => setPage('recommended')}>recommended</button>
        }
        {
          !token ?
            <button onClick={() => setPage('login')}>login</button>
            :
            (
              <>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={logout}>logout</button>
              </>
            )
        }

      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
      {
        user && user.favoriteGenre && <RecommendedBooks
          show={page === 'recommended'}
          fixGenre={user.favoriteGenre}
        />
      }


      <LoginForm
        show={page === 'login'}
        setToken={setToken}
      />

    </div>
  )
}

export default App