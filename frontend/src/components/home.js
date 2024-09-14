import React from "react";
import Navbar from "./navbar";
import { FiArrowDown, FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        
        <div className="home-text-section">
          <h1 className="primary-heading">
            hokie housing, <strong>made simple.</strong>
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