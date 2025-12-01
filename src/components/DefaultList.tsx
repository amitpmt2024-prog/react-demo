import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
}

const DefaultList = () => {
  const [movies, setMovie] = useState<Movie[]>([])
  useEffect(() => {
    const controller = new AbortController();
    const getMovies = async () => {
      try {
        const API_KEY = import.meta.env.VITE_MOVIE_API_KEY || "";
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`,
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
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
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