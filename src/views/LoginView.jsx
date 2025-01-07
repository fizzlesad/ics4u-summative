import React, { useState, useRef } from "react";
import "./LoginView.css";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useStoreContext } from "../context/index.jsx";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

function LoginView() {
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { setEmail } = useStoreContext();
  const [user, setUser] = useState(null);

  async function loginByEmail(event) {
    event.preventDefault();

    try {
      const email = emailRef.current.value;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setEmail(email);
      setUser(user);
      navigate("/movies");
    } catch (error) {
      console.error(error);
      alert("Error signing in!");
    }
  }

  async function loginByGoogle() {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      setUser(user);
      navigate("/movies");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Error signing in with Google!");
    }
  }

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
          <button onClick={loginByGoogle} className="login-button">
            Login by Google
          </button>
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