import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/index.jsx"
import HomeView from "../src/views/HomeView.jsx";
import RegisterView from "../src/views/RegisterView.jsx";
import LoginView from "../src/views/LoginView.jsx";
import GenreView from "../src/views/GenreView.jsx";
import MoviesView from "../src/views/MoviesView.jsx";
import DetailView from "../src/views/DetailView.jsx";
import CartView from "./views/CartView.jsx"
import SettingsView from "./views/SettingsView.jsx"

function App() {
  const genres = [
    {
      genre: "Action",
      id: 28,
    },
    {
      genre: "Family",
      id: 10751,
    },
    {
      genre: "Science Fiction",
      id: 878,
    },
    {
      genre: "Adventure",
      id: 12,
    },
    {
      genre: "Fantasy",
      id: 14,
    },
    {
      genre: "Animation",
      id: 16,
    },
    {
      genre: "History",
      id: 36,
    },
    {
      genre: "Thriller",
      id: 53,
    },
    {
      genre: "Comedy",
      id: 35,
    },
    {
      genre: "Horror",
      id: 27,
    },
  ];

  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView genres={genres} />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/movies" element={<MoviesView />}>
            <Route path="genre/:genre_id" element={<GenreView />} />
            <Route path="details/:id" element={<DetailView />} />
          </Route>
          <Route path="/cart" element={<CartView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
