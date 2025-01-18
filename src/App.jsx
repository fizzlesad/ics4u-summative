import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/index.jsx";
import HomeView from "../src/views/HomeView.jsx";
import RegisterView from "../src/views/RegisterView.jsx";
import LoginView from "../src/views/LoginView.jsx";
import GenreView from "../src/views/GenreView.jsx";
import MoviesView from "../src/views/MoviesView.jsx";
import DetailView from "../src/views/DetailView.jsx";
import CartView from "./views/CartView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import { useEffect } from "react";
import { useStoreContext } from "../src/context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import ProtectedRoutes from "./util/ProtectedRoutes";

function PrivateRoute({ element }) {
  const { user } = useStoreContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
}

function App() {
  const { setUser } = useStoreContext();
  const genres = [
    { genre: "Action", id: 28 },
    { genre: "Family", id: 10751 },
    { genre: "Science Fiction", id: 878 },
    { genre: "Adventure", id: 12 },
    { genre: "Fantasy", id: 14 },
    { genre: "Animation", id: 16 },
    { genre: "History", id: 36 },
    { genre: "Thriller", id: 53 },
    { genre: "Comedy", id: 35 },
    { genre: "Horror", id: 27 },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "User",
          lastName: user.displayName?.split(" ")[1] || "",
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView genres={genres} />} />
          <Route path="/login" element={<LoginView />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/movies" element={<MoviesView />}>
              <Route path="genre/:genre_id" element={<GenreView />} />
              <Route path="details/:id" element={<DetailView />} />
            </Route>
            <Route
              path="/cart"
              element={<PrivateRoute element={<CartView />} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<SettingsView />} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;