import React, {useEffect, useState} from 'react'
import {useMutation} from '@apollo/client'
import {LOGIN} from '../graphql/graphql'

const LoginForm = ({setToken}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage ] = useState()

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setErrorMessage(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const {accessToken} = result.data.login
      setToken(accessToken)
      localStorage.setItem('accessToken', accessToken)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    await login({variables: {username, password}})
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type={"password"}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm
