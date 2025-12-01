import { useEffect, useState } from "react";

const DefaultList = () => {
  const [movies, setMovie] = useState<any[]>([])
  useEffect(() => {
    const controller = new AbortController();
    const getMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/discover/movie?api_key=f43ec82a5f24fe6190891894b7436c7a",
          {
            headers: { "content-type": "application/json" },
            method: "GET",
            signal: controller.signal
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('data', data.results);
          setMovie(data.results);
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.log("error", error);
        }
      }
    }

    getMovies();

    return () => controller.abort();
  }, []);


  return (<div className="MovieList">
    {movies.map((movie) => {
      return (<div className="movie" key={movie.id}>
        <div className="image-container">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}></img>
        </div>

        <div className="movie-details">
          <h1 className="movie-title">{movie.title}</h1>
          <p className="movie-overview">Plot: {movie.overview}</p>
          <p className="movie-release-data">Release date: {movie.release_date}</p>
          <p className="movie-rating">Rating: {movie.vote_average}</p>

        </div>
      </div>)
    })}

  </div>);
}

export default DefaultList;