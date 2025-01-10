import "./GenreView.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useStoreContext } from "../context";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function GenreView() {
  const [done, setDone] = useState(false);
  const [movieArray, setMovieArray] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [addedMovies, setAddedMovies] = useState(new Set());
  const [purchasedMovies, setPurchasedMovies] = useState(new Set());
  const params = useParams();
  const { setCart, user } = useStoreContext();
  
  const fetchPurchasedMovies = async () => {
    if (user?.uid) {
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setPurchasedMovies(new Set(userData.purchasedMovies || []));
      }
    }
  };

  const movieData = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${params.genre_id}&api_key=${import.meta.env.VITE_TMDB_KEY}`
    );
    setMovieArray(response.data.results);
    setTotalPages(Math.min(response.data.total_pages, 500));
    setDone(true);
  };

  const movePage = (x) => {
    setDone(false);
    setPage((prevPage) => Math.max(1, Math.min(totalPages, prevPage + x)));
    movieData();
  };

  const setCurrentPage = (x) => {
    setDone(false);
    setPage(Math.min(totalPages, x));
    movieData();
  };

  const handleAddToCart = (movie) => {
    if (!purchasedMovies.has(movie.id)) {
      setCart((prevCart) =>
        prevCart.set(movie.id, {
          title: movie.original_title,
          url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
      );
      setAddedMovies((prevSet) => new Set(prevSet).add(movie.id));
    } else {
      alert("You have already purchased this movie.");
    }
  };

  useEffect(() => {
    movieData();
  }, [page, params.genre_id]);

  useEffect(() => {
    fetchPurchasedMovies();
  }, [user]);

  return (
    <div className="movie-posters">
      <div className="genre-view">
        <div className="movies-container">
          {movieArray.length > 0 ? (
            movieArray.map((movie) => (
              <div
                key={movie.id}
                className={`movie-item ${
                  purchasedMovies.has(movie.id) ? "purchased" : ""
                }`}
              >
                <Link to={`/movies/details/${movie.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                </Link>
                <button
                  className={`buy-button ${
                    addedMovies.has(movie.id) || purchasedMovies.has(movie.id)
                      ? "added"
                      : ""
                  }`}
                  onClick={() => handleAddToCart(movie)}
                  disabled={purchasedMovies.has(movie.id)}
                >
                  {purchasedMovies.has(movie.id)
                    ? "Purchased"
                    : addedMovies.has(movie.id)
                    ? "Added"
                    : "Buy"}
                </button>
              </div>
            ))
          ) : (
            <p>No movies available for this genre</p>
          )}
        </div>
        <div className="pagination">
          <a onClick={() => setCurrentPage(1)}>&laquo;</a>
          <a onClick={() => movePage(-1)}>{"<"}</a>
          <a className="active">{page}</a>
          <a onClick={() => movePage(1)}>{">"}</a>
          <a onClick={() => setCurrentPage(totalPages)}>&raquo;</a>
        </div>
      </div>
    </div>
  );
}

export default GenreView;