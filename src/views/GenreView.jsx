import "./GenreView.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useStoreContext } from "../context";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function GenreView() {
    const [done, setDone] = useState(false);
    const [movieArray, setMovieArray] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [purchasedMovies, setPurchasedMovies] = useState(new Set());
    const [addedMovies, setAddedMovies] = useState(new Set()); // Declare addedMovies here
    const params = useParams();
    const { cart, setCart, user } = useStoreContext();

    const fetchPurchasedMovies = async () => {
        if (user?.uid) {
            try {
                const userDoc = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDoc);
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setPurchasedMovies(new Set(userData.purchasedMovies || []));
                }
            } catch (error) {
                console.error("Error fetching purchased movies:", error);
            }
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${params.genre_id}&api_key=${import.meta.env.VITE_TMDB_KEY}`
            );
            setMovieArray(response.data.results);
            setTotalPages(Math.min(response.data.total_pages, 500));
            setDone(true);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        }
    };

    useEffect(() => {
        const cartMovieIds = new Set(cart.keySeq().toArray());
        setAddedMovies(cartMovieIds); // Use the setter to update the state
    }, [cart]);

    useEffect(() => {
        fetchMovies();
        fetchPurchasedMovies();
    }, [page, params.genre_id]);

    const handleAddToCart = (movie) => {
        if (!purchasedMovies.has(movie.original_title) && !cart.has(movie.id)) {
            const updatedCart = cart.set(movie.id, {
                title: movie.original_title,
                url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });

            setCart(updatedCart);
        } else {
            alert("You have already purchased or added this movie.");
        }
    };

    const getButtonState = (movie) => {
        if (purchasedMovies.has(movie.original_title)) return "Purchased";
        if (cart.has(movie.id)) return "Added";
        return "Buy";
    };

    return (
        <div className="movie-posters">
            <div className="genre-view">
                <div className="movies-container">
                    {movieArray.length > 0 ? (
                        movieArray.map((movie) => (
                            <div
                                key={movie.id}
                                className={`movie-item ${purchasedMovies.has(movie.original_title) ? "purchased" : ""}`}
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
                                        getButtonState(movie) === "Added" || getButtonState(movie) === "Purchased"
                                            ? "added"
                                            : ""
                                    }`}
                                    onClick={() => handleAddToCart(movie)}
                                    disabled={getButtonState(movie) === "Purchased"}
                                >
                                    {getButtonState(movie)}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No movies available for this genre</p>
                    )}
                </div>
                <div className="pagination">
                    <a onClick={() => setPage(1)}>&laquo;</a>
                    <a onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>&#60;</a>
                    <a onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>&#62;</a>
                    <a onClick={() => setPage(totalPages)}>&raquo;</a>
                </div>
            </div>
        </div>
    );
}

export default GenreView;
