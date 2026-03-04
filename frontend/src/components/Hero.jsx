import campus1 from "../assets/campus1.jfif";
import campus2 from "../assets/campus2.jpg";
import campus3 from "../assets/campus3.jpg";
import campus4 from "../assets/campus4.png";
import campus5 from "../assets/campus5.png";

export default function Hero() {
  return (
    <div className="container-fluid p-0">

      <div
        id="heroCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >

        {/* Indicators */}
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="4"></button>
        </div>

        {/* Slides */}
        <div className="carousel-inner">

          <div className="carousel-item active">
            <img src={campus1} className="d-block w-100 hero-img" alt="Slide 1" />
          </div>

          <div className="carousel-item">
            <img src={campus2} className="d-block w-100 hero-img" alt="Slide 2" />
          </div>

          <div className="carousel-item">
            <img src={campus3} className="d-block w-100 hero-img" alt="Slide 3" />
          </div>

          <div className="carousel-item">
            <img src={campus4} className="d-block w-100 hero-img" alt="Slide 4" />
          </div>

          <div className="carousel-item">
            <img src={campus5} className="d-block w-100 hero-img" alt="Slide 5" />
          </div>

        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

      </div>

    </div>
  );
}