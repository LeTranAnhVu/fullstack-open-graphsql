import React, {useEffect, useState} from 'react'
import {useMutation} from '@apollo/client'
import {ALL_AUTHORS, EDIT_AUTHOR} from '../graphql/graphql'
import Select from 'react-select'

const EditAuthor = ({authors}) => {
  const [born, setBorn] = useState('')
  const [errorMessage, setErrorMessage] = useState()
  const [selectedAuthor, setSelectedAuthor] = useState()
  const [authorSelections, setAuthorSelections] = useState()

  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: (errors) => {
      console.log(errors)
      setErrorMessage('cannot log error with error.graphQLErrors[0].message')
    }
  })

  useEffect(() => {
    setAuthorSelections(authors.map(({name}) =>({
      value: name,
      label: name
    })))
  }, [authors])


  useEffect(() => {
    if (result.data && !result.data.editAuthor) {
      setErrorMessage('Cannot edit author')
    }
  }, [result.data])

  const selectAuthor = (selectedOption) => {
    setSelectedAuthor(selectedOption)
  }
  const submit = async (event) => {
    event.preventDefault()
    await editAuthor({variables: {name: selectedAuthor.value, born: parseInt(born)}})
    console.log('update ...')
    setBorn('')
  }
  return (
    <div>
      <form onSubmit={submit}>
        <Select
          value={selectedAuthor}
          onChange={selectAuthor}
          options={authorSelections}
        />
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({target}) => setBorn(target.value)}
          />
        </div>
        {errorMessage && <p>{errorMessage}</p>}
        <button type='submit'>update</button>
      </form>
    </div>
  )
}

export default EditAuthor