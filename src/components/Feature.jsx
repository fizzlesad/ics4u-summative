import "./Feature.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Feature() {
  const [movieArray, setMovieArray] = useState([]);
  const [movie1, setMovie1] = useState({});
  const [movie2, setMovie2] = useState({});
  const [movie3, setMovie3] = useState({});
  const [done, setDone] = useState(false);

  async function data() {
    const options = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${
        import.meta.env.VITE_TMDB_KEY
      }`
    );
    setMovieArray(options.data.results);
    setMovie1(movieArray[Math.floor(Math.random() * movieArray.length)]);
    setMovie2(movieArray[Math.floor(Math.random() * movieArray.length)]);
    setMovie3(movieArray[Math.floor(Math.random() * movieArray.length)]);
    setDone(true);
    return options;
  }

  useEffect(() => {
    data();
  }, [done]);

  return (
    <div class="feature-container">
      <p class="featured-title">Featured</p>
      <img
        class="movie-one"
        src={`https://image.tmdb.org/t/p/w500${movie1?.poster_path}`}
      ></img>
      <img
        class="movie-two"
        src={`https://image.tmdb.org/t/p/w500${movie2?.poster_path}`}
      ></img>
      <img
        class="movie-three"
        src={`https://image.tmdb.org/t/p/w500${movie3?.poster_path}`}
      ></img>
    </div>
  );
}
export default Feature;
