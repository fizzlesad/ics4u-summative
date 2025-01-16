import React, { useState, useRef } from "react";
import "./LoginView.css";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useStoreContext } from "../context/index.jsx";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function LoginView() {
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useStoreContext();

  const loginByEmail = async (event) => {
    event.preventDefault();
    try {
      console.log("All localStorage data:", { ...localStorage }); // Log all localStorage data

      const email = emailRef.current.value;
      const storedUser = JSON.parse(localStorage.getItem("user")); // Retrieve user data
      console.log("Retrieved from localStorage:", storedUser);

      if (storedUser && storedUser.email === email) {
        setUser({
          ...storedUser,
          isLoggedIn: true,
        });
        navigate("/movies");
      } else {
        alert("User not found in local storage. Please register.");
      }
    } catch (error) {
      alert("Error signing in: " + error.message);
    }
  };


  return (
    <>
      <Header />
      <div className="login-container">
        <h2 className="login-message">Login to Your Account</h2>
        <div className="form-container">
          <form onSubmit={loginByEmail}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" ref={emailRef} required />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
