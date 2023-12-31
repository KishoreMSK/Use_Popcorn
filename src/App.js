import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const key = ''

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo(){
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox({query , setQuery}){

  return(
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
  />
  )
}
function NumResults(){
  return(
    <p className="num-results">
       Found <strong>X</strong> results
     </p>
  )
}

function MovieDetails({selectedId}){
  const [movie,setMovie] = useState({})
  useEffect(function () {
    //used to handle multiple api calls at a time by cancelling all the calls except the last call
    //add {signal : controller.signal} after the fetch api call
    const controller = new AbortController() 

    function findMovies() {
      const item = tempWatchedData.find((movie) => movie.imdbID === selectedId);
      setMovie(item);
    }
    findMovies();
  });
  useEffect(function(){
    if(!movie.Title) return
    document.title = `Movie ${movie.Title}`
    //cleanup function to clear the value of state when the component in unmounted
    return () => {
      document.title = 'usepopcorn'  
    }
  }, [movie?.Title]);
  return(
    <div className="details">
      <header>
        <img src={movie?.Poster} alt={`Poster of ${movie?.Title} movie`}/>
        <div className="details-overview">
            <p>{movie?.Title}</p>
            <p>Realesed on: {movie?.Year}</p>
            <p>Runtime: {movie?.runtime}</p>
            <span>⭐{movie?.imdbRating} IMDB Rating</span>
        </div>
      </header>
      <section>
        <p>Plot</p>
      </section>
       
    </div>
  )
}

function Main({query, setQuery}){
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const[selectedId, setSelectedId] = useState(null)

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  const yourkey = '19014'

  function handleClick(id){
    console.log(id)
    setSelectedId(selectedId => selectedId === id ? null : id)
  }
  useEffect(function() {
    async function fetchMovies(){
      try {
        setIsLoading(true);
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${yourkey}&s=${query}`);
        if(!res.ok)
          throw new Error('Something went wrong while fetching movies')

        const data = await res.json();
        console.log(data);
        if(data.Response === 'False')
          throw new Error('Movie not found')
        // setMovies(data.Search)

      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
      
    }
    if(query.length < 3){
      // setMovies([])
      setError("")
      return
    }
     
    fetchMovies();
  },[query]);
  return(
    <main className="main">
        {isLoading && <p className="loader">Loading...</p>}
        {!isLoading && !error && <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((open) => !open)}
          >
            {isOpen1 ? "–" : "+"}
          </button>
          {isOpen1 && (
            <ul className="list list-movies">
              {movies?.map((movie) => (
                <li key={movie.imdbID} onClick={() => handleClick(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>}
        {error &&  <p className="error">Alert: {error} </p>}
        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && selectedId ? <MovieDetails selectedId={selectedId}/> : (
            <>
              <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>

              <ul className="list">
                {watched.map((movie) => (
                  <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
                    <h3>{movie.Title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
  )
}
export default function App() {
  const [query, setQuery] = useState("");
  return (
    <>
      <nav className="nav-bar">
      <Logo/>
      <SearchBox query={query} setQuery={setQuery}/>
      <NumResults/>
      </nav>  
      <Main query={query} setQuery={setQuery}/>
    </>
  );
}
