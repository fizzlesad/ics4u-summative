import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./SettingsView.css";

const SettingsView = () => {
    const { user, setUser, genres } = useStoreContext();
    const navigate = useNavigate();
    const [selectedGenres, setSelectedGenres] = useState(user?.selectedGenres || []);
    const [pastPurchases, setPastPurchases] = useState([]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login"); // Redirect to login if no user
            return;
        }

        if (user.uid) {
            fetchUserData(user.uid);
        } else {
            console.warn("User ID is undefined.");
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
            } else {
                console.error("User not found in Firestore.");
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

        const updatedFirstName = e.target.firstname.value;
        const updatedLastName = e.target.lastname.value;

        if (newPassword && newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const updatedUser = {
                ...user,
                firstName: updatedFirstName,
                lastName: updatedLastName,
                selectedGenres,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);

            alert("Settings updated successfully!");
        } catch (error) {
            console.error("Error updating settings:", error);
            alert(`Error: ${error.message}`);
        }
    };

    if (!user) {
        return null; // Prevent rendering if user is not logged in
    }

    const isEmailUser = user?.providerId === "password";

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
                        {isEmailUser && (
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