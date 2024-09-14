import React from "react";
import Navbar from "./navbar";
import Quiz from "./quiz";
import { FiArrowDown } from "react-icons/fi";

const Home = () => {
  const handleClick = () => {
    var element = document.getElementById("divider");
    element.scrollIntoView();
    };
  return (
    <div className="home-container">
        <Navbar />
        <div className="home-banner-container">
        <div className="home-text-section">
            <h1 className="primary-heading">
            hokie housing, made simple.
            </h1>
            <button className="secondary-button" onClick={handleClick}>
            find your perfect housing situation <FiArrowDown />{" "}
            </button>
        </div>
        
      </div>
      <div id="divider" className="divider">
        <Quiz />
      </div>
    </div>
  );
};

export default Home;