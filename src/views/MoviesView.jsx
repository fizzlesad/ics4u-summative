import { Outlet, useNavigate } from "react-router-dom";
import "./MoviesView.css";
import React from "react";
import "./GenreView.css";
import Genres from "../components/Genres.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function MoviesView() {
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

  const navigate = useNavigate();

  function logout() {
    navigate("/");
  }

  return (
    <>
      <Header />
      <div className="movies-view-container">
        <div>
          <Genres genresList={genres} className="genre-list" />
        </div>
        <Outlet className="movie-posters" />
      </div>
      <Footer />
      <button onClick={() => logout()} className="logout-button">
        Logout
      </button>
    </>
  );
}

export default MoviesView;
