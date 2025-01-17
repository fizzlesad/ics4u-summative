import logo from "../assets/PossumLogo2.png";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { getAuth, signOut } from "firebase/auth";

function Header() {
  const { user, setUser } = useStoreContext();
  const navigate = useNavigate();
  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.setItem("user", null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const renderButtons = () => {
    if (!user) {
      return (
        <>
          <Link to="/login">
            <button className="sign-in-button">Sign In</button>
          </Link>
          <Link to="/register">
            <button className="sign-up-button">Sign Up</button>
          </Link>
        </>
      );
    } else {
      return (
        <div className="user-info">
          <p className="welcome-message">Hello, {user?.firstName || "User"}!</p>
          <div className="user-buttons">
            <button onClick={() => navigate("/cart")}>Cart</button>
            <button onClick={() => navigate("/settings")}>Settings</button>
            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="opaque-top-rectangle">
      <img className="possum-logo" src={logo} alt="Possum Logo" />
      <p className="title">Possum</p>
      <div className="choice-side">{renderButtons()}</div>
    </div>
  );
}

export default Header;