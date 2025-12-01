// import { useState } from "react";
import DefaultList from "./DefaultList";

const SearchBar = () => {
    // try {
    //     const [searchQuery, setSearchQuery] = useState<string | null>("");
    //     const [movie, setMovie] = useState<string[]>([]);
    //     const [error, setError] = useState<string | null>("");

    //     const searchMovie = async () => {
    //         const query = 'family';
    //         const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f43ec82a5f24fe6190891894b7436c7a&query=${query}`);
    //         if (response?.ok) {
    //             const data = await response.json();
    //             setMovie(data.results);
    //             setError("");
    //         } else {
    //             setError("Error while fetching movies");
    //             setMovie([]);
    //         }
    //     }
    // } catch (error: any) {
    //     console.log('error', error);
    // }


    return (
    <div>
        <form action="" className="form">
           <input type="text"></input>
           {/* {error && <p>{error}</p>} */}
        </form>
        <DefaultList />
    </div>
);
}

export default SearchBar;