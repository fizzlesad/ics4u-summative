import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import "./SettingsView.css";

const SettingsView = () => {
  const { email, setEmail } = useStoreContext();
  const { firstName, setFirstName } = useStoreContext();
  const { lastName, setLastName } = useStoreContext();
  const { genres } = useStoreContext();
  const { selectedGenres, setSelectedGenres } = useStoreContext();
  const navigate = useNavigate();

  const updateSettings = (e) => {
    e.preventDefault();

    if (selectedGenres.length < 10) {
      alert("You must select at least 10 genres.");
      return;
    }

    setFirstName(e.target.firstname.value);
    setLastName(e.target.lastname.value);
    setEmail(e.target.email.value);

    alert("Settings updated successfully!");
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) {
        return prev.filter((id) => id !== genreId);
      } else {
        return [...prev, genreId];
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <div className="form">
          <form onSubmit={(e) => updateSettings(e)}>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" defaultValue={email} required />
            <label htmlFor="first-name">First Name:</label>
            <input type="text" name="firstname" defaultValue={firstName} required />
            <label htmlFor="last-name">Last Name:</label>
            <input type="text" name="lastname" defaultValue={lastName} required />
            <div className="genres-list">
              {genres.map((genre) => (
                <div key={genre.id} className="genre-checkbox">
                  <input
                    type="checkbox"
                    id={genre.id}
                    checked={selectedGenres.includes(genre.id)}
                    onChange={() => handleGenreChange(genre.id)}
                  />
                  <label htmlFor={genre.id}>{genre.genre}</label>
                </div>
              ))}
            </div>
            <input type="submit" value={"Save Settings"} />
          </form>
          <button onClick={() => navigate("/movies")}>Back</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsView;
