import React from "react";
import Navbar from "./navbar";
import BannerBackground from "../assets/background.webp"
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">
            hokie housing, made simple.
          </h1>
          <p className="primary-text">
            let's find the perfect housing situation for you!
          </p>
          <button className="secondary-button">
            take the quiz <FiArrowDown />{" "}
          </button>
        </div>
        <div className="home-image-section">
          
        </div>
      </div>
    </div>
  );
};

export default Home;