import "./Genres.css";
import { Link } from "react-router-dom";
import { useStoreContext } from "../context";

function Genres() {
  const { genres, selectedGenres } = useStoreContext();

  const filteredGenres = genres.filter((genre) =>
    selectedGenres.length === 0 || selectedGenres.includes(genre.id)
  );

  return (
    <div className="genres-container">
      <ul className="genres-list">
        {filteredGenres.map((genre) => (
          <li key={genre.id} className="genre-item">
            <Link to={`/movies/genre/${genre.id}`} className="genre-link">
              {genre.genre}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Genres;
