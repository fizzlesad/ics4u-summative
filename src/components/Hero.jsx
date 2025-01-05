import "./Hero.css";
import heroBackground from "../assets/PFSBackground.jpg";

function Hero() {
  return (
    <div class="hero-container">
      <img class="hero-background" src={heroBackground}></img>
      <div class="hero-content-container">
        <p class="hero-main-text">Unlimited POSSUM Movies, Shows, and More</p>
        <p class="price-text">
          Starts at the low price of $0.01! Satisfaction Guaranteed.
        </p>
        <form action="">
          <div class="search-bar">
            <input type="text" placeholder="Search a movie..."></input>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Hero;
