import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const QuizWithGUI = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [listings, setListings] = useState([]); // Initialized as empty array
  const [answers, setAnswers] = useState({});
  const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [error, setError] = useState(null); // Optional: For error handling
  const [activeMarker, setActiveMarker] = useState(null);

  const questions = [
    {
      id: 0,
      question: "Ready to begin?",
      options: ["Yes"],
      type: "single",
      key: "is_freshman",
    },
    {
      id: 1,
      question: "What's your desired price point?",
      options: ["<$500", "~$1000", "~$1500", "$2000+"],
      type: "single",
      key: "desired_price",
    },
    {
      id: 2,
      question: "Do you want utilities included in the price?",
      options: ["Yes", "No"],
      type: "single",
      key: "utilities_included",
    },
    {
      id: 3,
      question: "How many bedrooms do you want?",
      options: ["1", "2", "3", "4"],
      type: "single",
      key: "desired_bedrooms",
    },
    {
      id: 4,
      question: "How many bathrooms do you want?",
      options: ["1", "2", "3", "4"],
      type: "single",
      key: "desired_bathrooms",
    },
    {
      id: 5,
      question: "Do you want it to come furnished?",
      options: ["Yes", "No"],
      type: "single",
      key: "furnished",
    },
    {
      id: 6,
      question: "Do you want it to have A/C?",
      options: ["Yes", "No"],
      type: "single",
      key: "airConditioning",
    },
    {
      id: 7,
      question: "What amenities would you like?",
      options: [
        "Parking",
        "EV charger",
        "Gym",
        "Internet",
        "Animal-Friendly",
        "Washer/Dryer",
        "Balcony",
      ],
      type: "multiple",
      key: "desired_amenities",
    },
    {
      id: 8,
      question: "Do you need access to public transit?",
      options: ["Yes", "No"],
      type: "single",
      key: "public_transit",
    },
    /** ON CAMPUS QUESTIONS START HERE
    // ... (Commented out on-campus questions)
    */
  ];

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQIndex];

    let formattedAnswer = answer;
    if (answer === "Yes") {
      formattedAnswer = true;
    } else if (answer === "No") {
      formattedAnswer = false;
    }

    // Convert numeric answers to integers (for price, bedrooms, bathrooms)
    if (currentQuestion.key === "desired_price") {
      // Map price ranges to numeric values
      if (answer === "<$500") formattedAnswer = 500;
      else if (answer === "~$1000") formattedAnswer = 1000;
      else if (answer === "~$1500") formattedAnswer = 1500;
      else if (answer === "$2000+") formattedAnswer = 2000;
    } else if (
      currentQuestion.key === "desired_bedrooms" ||
      currentQuestion.key === "desired_bathrooms"
    ) {
      // Convert bedrooms/bathrooms to integer
      formattedAnswer = parseInt(answer, 10);
    }

    // Save the answer to the current question
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.key]: formattedAnswer,
    }));

    let nextQIndex = currentQIndex + 1;

    // Removed conditional logic for non-existent questions (id 9-12)

    // Move to the next question or complete the quiz
    if (nextQIndex < questions.length) {
      setCurrentQIndex(nextQIndex);
    } else {
      setIsCompleted(true);
    }
  };

  // useEffect to submit answers when the quiz is completed
  useEffect(() => {
    if (isCompleted) {
      submitAnswers();
      // Removed getListings() from here to avoid redundant calls
    }
  }, [isCompleted]);

  // Function to submit answers via POST request
  const submitAnswers = () => {
    const postData = {
      on_campus: answers.is_freshman, // True if freshman, implying on-campus
      desired_price:
        answers.desired_price !== undefined ? answers.desired_price : null,
      utilities_included:
        answers.utilities_included !== undefined
          ? answers.utilities_included
          : null,
      airConditioning:
        answers.airConditioning !== undefined ? answers.airConditioning : null,
      public_transport:
        answers.public_transit !== undefined ? answers.public_transit : null,
      desired_amenities: answers.desired_amenities || [],
      furnished:
        answers.furnished !== undefined ? answers.furnished : null,
      desired_bathrooms:
        answers.desired_bathrooms !== undefined
          ? answers.desired_bathrooms
          : null,
      desired_bedrooms:
        answers.desired_bedrooms !== undefined
          ? answers.desired_bedrooms
          : null,
    };

    fetch("http://localhost:8000/housingapp/quiz-submit/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw err;
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setUserToken(data.user_token);
          getListings(data.user_token);
        } else {
          console.error("Server Error:", data.message);
          setError(data.message); // Optional: Display error to user
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message || "An error occurred"); // Optional: Display error to user
      });
  };

  // Function to fetch listings from backend
  const getListings = (user_token) => {
    fetch(`http://localhost:8000/housingapp/get-listings/?user_token=${user_token}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setListings(data.content || []); // Ensure listings is an array
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        setError(error.message || "Failed to fetch listings"); // Optional
      });
  };

  // Function to fetch detailed information for a selected listing
  const handleListingClick = (listing) => {
    // If the clicked listing is already selected, close it by setting selectedListing to null
    if (selectedListing && selectedListing.apt_id === listing.apt_id) {
      setSelectedListing(null); // Close the details
      setActiveMarker(null); // Close the marker's info window
      return; // Exit early to avoid fetching details again
    }

    // Otherwise, fetch the details of the newly clicked listing
    setDetailsLoading(true);
    setDetailsError(null);

    fetch(`http://localhost:8000/housingapp/get-details/?apt_id=${listing.apt_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('API Response:', data); // For debugging
        if (data.status === "success") {
          setSelectedListing(data.content); // Set the selected listing details
          setActiveMarker(listing.apt_id); // Open the marker's info window
        } else {
          setDetailsError(data.message || "Failed to load listing details.");
        }
        setDetailsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching listing details:", error);
        setDetailsError("Failed to load listing details.");
        setDetailsLoading(false);
      });
  };

  const currentQ = questions[currentQIndex];

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const defaultCenter = {
    lat: 37.2296, // Example: Blacksburg, VA coordinates
    lng: -80.4139,
  };

  const styles = {
    quizContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#F4F4F9",
      padding: "20px",
    },
    resultsContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      maxWidth: "1200px",
      gap: "20px",
    },
    listings: {
      flex: "1",
      overflowY: "auto",
      maxHeight: "80vh",
      paddingRight: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#ffffff",
    },
    map: {
      flex: "1",
      height: "80vh",
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflow: "hidden",
    },
    questionCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      width: "100%",
      textAlign: "center",
    },
    questionText: {
      fontSize: "24px",
      marginBottom: "20px",
    },
    optionsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      alignItems: "center",
    },
    optionButton: {
      padding: "10px 20px",
      fontSize: "18px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      width: "100%",
      maxWidth: "300px",
    },
    optionButtonHover: {
      backgroundColor: "#0056b3",
    },
    completionMessage: {
      textAlign: "center",
      fontSize: "22px",
      padding: "20px",
      backgroundColor: "#d4edda",
      borderRadius: "8px",
    },
    listingDetails: {
      marginTop: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
    },
    addressButton: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
      padding: 0,
      font: 'inherit',
      fontSize: '16px',
    },
    infoWindowContent: {
      maxWidth: '200px',
    },
  };

  return (
    <div className="quiz-container" style={styles.quizContainer}>
      {!isCompleted ? (
        <div className="question-card" style={styles.questionCard}>
          <h2 style={styles.questionText}>{currentQ.question}</h2>
          <div className="options-container" style={styles.optionsContainer}>
            {currentQ.type === "multiple" ? (
              <>
                {currentQ.options.map((option, index) => (
                  <label key={index} style={{ alignSelf: "flex-start" }}>
                    <input
                      type="checkbox"
                      value={option.trim()}
                      checked={multiSelectAnswers.includes(option.trim())}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setMultiSelectAnswers([
                            ...multiSelectAnswers,
                            option.trim(),
                          ]);
                        } else {
                          setMultiSelectAnswers(
                            multiSelectAnswers.filter(
                              (o) => o !== option.trim()
                            )
                          );
                        }
                      }}
                      style={{ marginRight: "10px" }}
                    />
                    {option.trim()}
                  </label>
                ))}
                <button
                  onClick={() => {
                    handleAnswer(multiSelectAnswers);
                    setMultiSelectAnswers([]); // Reset for next question
                  }}
                  style={styles.optionButton}
                >
                  Next
                </button>
              </>
            ) : (
              currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  style={styles.optionButton}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="results-container" style={styles.resultsContainer}>
          <div className="listings" style={styles.listings}>
            <h2>Available Listings</h2>
            {listings.length > 0 ? (
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {listings.map((listing) => (
                  <li
                    key={listing.apt_id}
                    style={{
                      marginBottom: '20px',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <p>
                      <button
                        onClick={() => handleListingClick(listing)}
                        style={styles.addressButton}
                      >
                        {listing.address}
                      </button>
                    </p>


                    <p>{listing.sq_ft} Sq Ft, {listing.num_rooms} Beds, {listing.num_bathrooms} Baths</p>
                    <p>{listing.address}</p>
                    
                    {/* Render Detailed Information */}
                    {selectedListing && selectedListing.apt_id === listing.apt_id && (
                      <div className="listing-details" style={styles.listingDetails}>
                        {detailsLoading ? (
                          <p>Loading details...</p>
                        ) : detailsError ? (
                          <p style={{ color: 'red' }}>{detailsError}</p>
                        ) : (
                          <>
                            <p><strong>Distance from Campus:</strong> {selectedListing.distance_from_campus_miles} miles</p>
                            <p><strong>Price per Month:</strong> ${selectedListing.price_per_month}</p>
                            <p><strong>Utilities Included:</strong> {selectedListing.utilities_included ? 'Yes' : 'No'}</p>
                            <p><strong>Furnished:</strong> {selectedListing.furnished ? 'Yes' : 'No'}</p>
                            <p><strong>Public Transit Access:</strong> {selectedListing.near_public_transport ? 'Yes' : 'No'}</p>
                            <p><strong>Amenities:</strong> {selectedListing.amenities.join(', ')}</p>
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No listings found matching your preferences.</p>
            )}
          </div>
          <div className="map" style={styles.map}>
            <LoadScript googleMapsApiKey={"AIzaSyCj8UmwW_QrcP0-rLEWH3sB1L1n6sZVE1I"}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={
                  selectedListing
                    ? { lat: selectedListing.latitude, lng: selectedListing.longitude }
                    : defaultCenter
                }
                zoom={selectedListing ? 14 : 12}
              >
                {listings.map((listing) => (
                  <Marker
                    key={listing.apt_id}
                    position={{ lat: listing.latitude, lng: listing.longitude }}
                    onClick={() => handleListingClick(listing)}
                  >
                    {activeMarker === listing.apt_id && (
                      <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                        <div style={styles.infoWindowContent}>
                          <h3>{listing.address}</h3>
                          <p>Price: ${listing.price_per_month}</p>
                          {/* Add more details if desired */}
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizWithGUI;
