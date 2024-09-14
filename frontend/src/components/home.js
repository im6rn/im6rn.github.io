import React from "react";
import Navbar from "./navbar";
import Quiz from "./quiz";
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
            
            <button className="secondary-button">
            find your perfect housing situation <FiArrowDown />{" "}
            </button>
        </div>
        
      </div>
      <div className="divider">
        <Quiz />
      </div>
    </div>
  );
};

export default Home;