import logo from "../assets/PossumLogo2.png";
import "./Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";

function Header() {
  const { firstName } = useStoreContext();
  let { email } = useStoreContext();
  const navigate = useNavigate();

  const loginButtons = () => {
    if (email == "") {
      return (
        <>
          <Link to={`/login`}>
            <button className="sign-in-button">Sign In</button>
          </Link>
          <Link to={`/register`}>
            <button className="sign-up-button">Sign Up</button>
          </Link>
        </>
      );
    } else {
      return (
        <div className="user-info">
          <p className="welcome-message">{`Hello ${firstName}!`}</p>
          <div className="user-buttons">
            <button onClick={() => navigate("/cart")}>Cart</button>
            <button onClick={() => navigate("/settings")}>Settings</button>
            <a className="logout-button" href="/">Log Out</a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="opaque-top-rectangle">
      <img className="possum-logo" src={logo} alt="Possum Logo" />
      <p className="title">Possum</p>
      <div className="choice-side">
        {loginButtons()}
      </div>
    </div>
  );
}

export default Header;
