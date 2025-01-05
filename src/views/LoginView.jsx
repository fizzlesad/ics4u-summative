import React from "react";
import "./LoginView.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useStoreContext } from "../context/index.jsx";

function LoginView() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setEmail } = useStoreContext();

  function login(e) {
    e.preventDefault();
    if (password === "iloveyou") {
      navigate("/movies");
      setEmail(e.target.email.value);
    } else {
      alert("Wrong password!");
    }
  }

  return (
    <>
      <Header />
      <div className="login-container">
        <h2 className="login-message">Login to Your Account</h2>
        <div className="form-container">
          <form
            onSubmit={(event) => {
              login(event);
            }}
          >
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              required
            />

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="register-link">
            New to Possum? <Link to="/register">Register now</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginView;
