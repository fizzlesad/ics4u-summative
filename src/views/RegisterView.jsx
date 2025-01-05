import "./RegisterView.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useStoreContext } from "../context/index.jsx";

function RegisterView() {
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const { email, setEmail } = useStoreContext();
  const { firstName, setFirstName } = useStoreContext();
  const { lastName, setLastName } = useStoreContext();
  const { genres } = useStoreContext();
  const { selectedGenres, setSelectedGenres } = useStoreContext();
  const navigate = useNavigate();

  const checkPass = (e) => {
    e.preventDefault();

    if (selectedGenres.length < 10) {
      alert("You must select at least 10 genres.");
      return;
    }

    if (pass1 === pass2) {
      setFirstName(e.target.firstname.value);
      setLastName(e.target.lastname.value);
      setEmail(e.target.email.value);
      navigate("/movies");
    } else {
      alert("Passwords need to be the same.");
    }
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
    <>
      <Header />
      <div className="register-container">
        <div className="form-container">
          <h2>Create an Account</h2>
          <form onSubmit={(e) => checkPass(e)}>
            <label htmlFor="first-name">First Name:</label>
            <input type="text" id="firstname" defaultValue={firstName} required />
            <label htmlFor="last-name">Last Name:</label>
            <input type="text" id="lastname" defaultValue={lastName} required />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" defaultValue={email} required />
            <label htmlFor="pass">Password:</label>
            <input
              type="password"
              id="password"
              value={pass1}
              onChange={(event) => setPass1(event.target.value)}
              required
            />
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={pass2}
              onChange={(event) => setPass2(event.target.value)}
              required
            />
            <div className="genres-list">
              <ul>
                {genres.map((item) => (
                  <div key={item.id} className="checkbox">
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={selectedGenres.includes(item.id)}
                      onChange={() => handleGenreChange(item.id)}
                    />
                    <label htmlFor={item.id}>{item.genre}</label>
                  </div>
                ))}
              </ul>
            </div>
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
          <Link to={`/login`}>
            <p className="login-link">
              Already have an account? <a href="#">Login</a>
            </p>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RegisterView;
