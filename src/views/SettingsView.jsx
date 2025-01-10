import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import "./SettingsView.css";

const SettingsView = () => {
  const { user, setUser, genres, selectedGenres, setSelectedGenres } = useStoreContext();
  const navigate = useNavigate();
  const [pastPurchases, setPastPurchases] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserGenres(user.uid);
      fetchPastPurchases(user.uid);
    }
  }, [user]);

  const fetchUserGenres = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data();
      setSelectedGenres(userData.genres || []);
    }
  };

  const fetchPastPurchases = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setPastPurchases(userData.purchasedMovies || []);
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();

    if (selectedGenres.length < 10) {
      alert("You must select at least 10 genres.");
      return;
    }

    try {
      if (user) {
        const auth = getAuth();

        const updatedFirstName = e.target.firstname.value;
        const updatedLastName = e.target.lastname.value;
        const updatedEmail = e.target.email.value;
        if (updatedEmail !== user.email) {
          await updateEmail(auth.currentUser, updatedEmail);
        }
        if (newPassword && newPassword === confirmPassword) {
          await updatePassword(auth.currentUser, newPassword);
        } else if (newPassword !== confirmPassword) {
          alert("Passwords do not match.");
          return;
        }
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          genres: selectedGenres,
          firstName: updatedFirstName,
          lastName: updatedLastName,
        }, { merge: true });
        setUser(prevUser => ({
          ...prevUser,
          firstName: updatedFirstName,
          lastName: updatedLastName,
        }));

        alert("Settings updated successfully!");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
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
    <div>
      <Header />
      <div className="form-container">
        <div className="form">
          <form onSubmit={updateSettings}>
            {user && (
              <>
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={user.email} 
                  disabled
                  required 
                />
                <label htmlFor="first-name">First Name:</label>
                <input 
                  type="text" 
                  name="firstname" 
                  defaultValue={user.firstName}
                  required 
                />
                <label htmlFor="last-name">Last Name:</label>
                <input 
                  type="text" 
                  name="lastname" 
                  defaultValue={user.lastName}
                  required 
                />
                <label htmlFor="new-password">New Password:</label>
                <input
                  type="password"
                  name="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <label htmlFor="confirm-password">Confirm New Password:</label>
                <input
                  type="password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
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
                <input type="submit" value="Save Settings" />
              </>
            )}

            {!user && <p>Please log in to update your settings.</p>}
          </form>
          <button onClick={() => navigate("/movies")}>Back</button>
        </div>
      </div>
      {user && (
        <div className="past-purchases">
          <h3>Past Purchases</h3>
          {pastPurchases.length > 0 ? (
            <ul>
              {pastPurchases.map((purchase, index) => (
                <li key={index}>
                  {purchase.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No past purchases found.</p>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SettingsView;