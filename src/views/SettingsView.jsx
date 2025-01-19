import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { updatePassword } from "firebase/auth";
import { useStoreContext } from "../context";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./SettingsView.css";

const SettingsView = () => {
    const { user, setUser, genres } = useStoreContext();
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState(user?.firstName || "");
    const [lastname, setLastname] = useState(user?.lastName || "");
    const [selectedGenres, setSelectedGenres] = useState(user?.selectedGenres || []);
    const [pastPurchases, setPastPurchases] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.uid) {
            fetchUserData(user.uid);
        }
    }, [user, navigate]);

    const fetchUserData = async (userId) => {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                setSelectedGenres(userData.selectedGenres || []);
                setPastPurchases(userData.purchasedMovies || []);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Could not load your settings. Please try again later.");
        }
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenres((prev) =>
            prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
        );
    };

    const updateSettings = (e) => {
        e.preventDefault();

        if (newPassword && newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        const updatedUser = {
            ...user,
            firstName: firstname,
            lastName: lastname,
            selectedGenres,
        };

        if (newPassword && user?.providerData?.some((provider) => provider.providerId === "password")) {
            updatePassword(auth.currentUser, newPassword)
                .then(() => {
                    setUser(updatedUser);
                    alert("Settings updated successfully!");
                })
                .catch((error) => {
                    console.error("Error updating password:", error);
                    setErrorMessage("Error updating password. Please try again.");
                });
        } else {
            setUser(updatedUser);
            alert("Settings updated successfully!");
        }
    };

    if (!user) {
        return null;
    }

    const isGoogleUser = user?.providerData?.some(
        (provider) => provider.providerId === "google.com"
    );

    return (
        <div>
            <Header />
            <div className="form-container">
                <div className="form">
                    <form onSubmit={updateSettings}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email || ""}
                            readOnly
                        />
                        <label htmlFor="firstname">First Name:</label>
                        <input
                            type="text"
                            name="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            readOnly={isGoogleUser} // Ensure it's read-only if Google login
                        />
                        <label htmlFor="lastname">Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            readOnly={isGoogleUser} // Ensure it's read-only if Google login
                        />
                        {!isGoogleUser && (  // Only show password fields for non-Google users
                            <>
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
                            </>
                        )}
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                    </form>
                    <button onClick={() => navigate("/movies")}>Back</button>
                </div>
            </div>
            <div className="past-purchases">
                <h3>Past Purchases</h3>
                {pastPurchases.length > 0 ? (
                    <ul>
                        {pastPurchases.map((title, index) => (
                            <li key={index}>{title}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No past purchases found.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SettingsView;
