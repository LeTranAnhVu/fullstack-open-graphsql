import React, {useEffect, useState} from 'react'
import { ALL_GENRES} from '../graphql/graphql'
import { useQuery} from '@apollo/client'

const Genres = ({setFilterGenre}) => {
  const {loading, error, data} = useQuery(ALL_GENRES)
  const [genres, setGenres] = useState([])

  const extractGenres = (genresRaw = []) => {
    console.log(genresRaw.map(genreRaw => genreRaw.genre))
    return genresRaw.map(genreRaw => genreRaw.genre)
  }

  useEffect(() => {
    console.log(data)
    if (data && data.genres) {
      setGenres(extractGenres(data.genres))
    }
  }, [data])

  if (error) {
    return <div>
      <p>error: Internal error</p>
    </div>
  }
  if (loading) {
    return <p>loading ...</p>
  }
  if (!genres) {
    return <p>loading ...</p>
  }

  return (
    <div>
      <button onClick={() => setFilterGenre('')}>all</button>
      {genres.map(genre => <button key={genre} onClick={() => setFilterGenre(genre)}>{genre}</button>)}
    </div>
  )
}

export default Genres