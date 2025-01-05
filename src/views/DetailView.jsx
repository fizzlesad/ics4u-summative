import "./DetailView.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailView = () => {
  const params = useParams();
  const [done, setDone] = useState(false);
  const [information, setInformation] = useState({});
  const [trailerList, setTrailerList] = useState([]);
  const [videos, setVideos] = useState([]);

  const options = async () => {
    const movieDetails = await axios.get(
      `https://api.themoviedb.org/3/movie/${params.id}?language=en-US&api_key=${
        import.meta.env.VITE_TMDB_KEY
      }`
    );
    const trailerData = await axios.get(
      `https://api.themoviedb.org/3/movie/${
        params.id
      }/videos?language=en-US&api_key=${import.meta.env.VITE_TMDB_KEY}`
    );
    setVideos(trailerData.data.results);
    setInformation(movieDetails.data);
    setDone(true);
  };

  useEffect(() => {
    options();
    const trailerList = [];
    for (const video of videos) {
      if (video.type == "Trailer") {
        trailerList.push(video);
      }
    }
    setTrailerList(trailerList);
  }, [done]);

  return (
    <div className="detail-container">
      {trailerList.map((video) => (
        <iframe
          key={video.id}
          width="640"
          height="360"
          className="trailers"
          src={`https://youtube.com/embed/${video.key}`}
        ></iframe>
      ))}
      <h2 className="title">{information.title}</h2>
      <div className="time-rating-container">
        <p className="time">{information.runtime} min</p>
        <p className="average-rating">{information.vote_average} stars</p>
      </div>
      <p className="vote-count">Vote Count: {information.vote_count}</p>
      <h3 className="overview-title">Overview:</h3>
      <p className="overview-body">{information.overview}</p>
      <h3 className="popularity-title">Popularity:</h3>
      <p className="popularity-body">{information.popularity}</p>
      <h3 className="revenue-title">Revenue:</h3>
      <p classname="revenue-body">${information.revenue}</p>
      <h3 className="date-title">Release Date:</h3>
      <p className="date-body">{information.release_date}</p>
    </div>
  );
};

export default DetailView;
