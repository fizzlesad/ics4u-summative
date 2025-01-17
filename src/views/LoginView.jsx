import React, { useState, useRef } from "react";
import "./LoginView.css";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useStoreContext } from "../context/index.jsx";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

function LoginView() {
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const navigate = useNavigate();
  const { setUser } = useStoreContext();

  const loginByEmail = async (event) => {
    event.preventDefault();
    try {
      const email = emailRef.current.value;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(" ")[0] || "User",
        lastName: firebaseUser.displayName?.split(" ")[1] || "",
        password: password
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/movies");
    } catch (error) {
      alert("Error signing in: " + error.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        firstName: firebaseUser.displayName?.split(" ")[0] || "User",
        lastName: firebaseUser.displayName?.split(" ")[1] || "",
        password: null
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      navigate("/movies");
    } catch (error) {
      alert("Error signing in with Google: " + error.message);
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

          <button onClick={loginWithGoogle} className="google-login-button">
            Login with Google
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