import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase"; // Ensure this is correctly initialized
import { useStoreContext } from "../context/index.jsx";
import { doc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Import necessary functions

function RegisterView() {
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const { setUser, genres, selectedGenres, setSelectedGenres } = useStoreContext();
  const navigate = useNavigate();

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const saveUserDataToFirestore = async (uid) => {
    try {
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        selectedGenres,
        purchasedMovies: [], // Initialize purchased movies as an empty array
      });
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
      alert("There was an issue saving your preferences. Please try again later.");
    }
  };

  const registerByEmail = async (e) => {
    e.preventDefault();

    if (selectedGenres.length < 10) {
      alert("You must select at least 10 genres.");
      return;
    }

    if (pass1 !== pass2) {
      alert("Passwords must match.");
      return;
    }

    try {
      const firstName = e.target.firstname.value;
      const lastName = e.target.lastname.value;
      const email = e.target.email.value;

      const userCredential = await createUserWithEmailAndPassword(auth, email, pass1);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: `${firstName} ${lastName}` });

      // Ensure providerData is included here
      const userData = {
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email,
        providerData: firebaseUser.providerData || [{ providerId: 'email/password' }], // Ensure providerData is set
      };
      
      // Storing the user in localStorage, including providerData
      localStorage.setItem("user", JSON.stringify(userData));
      await saveUserDataToFirestore(firebaseUser.uid);
      setUser({ ...userData, isLoggedIn: true });

      navigate("/movies");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const registerByGoogle = async () => {
    if (selectedGenres.length < 10) {
      alert("You must select at least 10 genres.");
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); // This should now work
      const firebaseUser = result.user;

      const [firstName, lastName] = firebaseUser.displayName
        ? firebaseUser.displayName.split(" ")
        : ["", ""];

      // Ensure providerData is included
      const userData = {
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email: firebaseUser.email,
        providerData: firebaseUser.providerData || [{ providerId: 'google.com' }], // Ensure providerData is set
      };

      // Storing the user in localStorage, including providerData
      localStorage.setItem("user", JSON.stringify(userData));
      await saveUserDataToFirestore(firebaseUser.uid);
      setUser({ ...userData, isLoggedIn: true });

      navigate("/movies");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Header />
      <div className="register-container">
        <div className="form-container">
          <h2>Create an Account</h2>
          <form onSubmit={registerByEmail}>
            <label htmlFor="firstname">First Name:</label>
            <input type="text" id="firstname" required />
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id="lastname" required />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" required />
            <label htmlFor="password">Password:</label>
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
          <button onClick={registerByGoogle} className="register-button">
            Register by Google
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RegisterView;
