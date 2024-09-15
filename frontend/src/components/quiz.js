// QuizWithGUI.js

import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const QuizWithGUI = () => {
  // State Variables
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [listings, setListings] = useState([]); // Original listings from API
  const [geocodedListings, setGeocodedListings] = useState([]); // Listings with lat/lng
  const [answers, setAnswers] = useState({});
  const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [error, setError] = useState(null); // For general errors
  const [activeMarker, setActiveMarker] = useState(null);

  // Ref for the map instance
  const mapRef = useRef(null);

  // Callback to set the map instance when loaded
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Quiz Questions
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

  // Handle Answer Selection
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

    // Move to the next question or complete the quiz
    if (nextQIndex < questions.length) {
      setCurrentQIndex(nextQIndex);
    } else {
      setIsCompleted(true);
    }
  };

  // Submit Answers when Quiz is Completed
  useEffect(() => {
    if (isCompleted) {
      submitAnswers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted]);

  // Function to Submit Answers via POST Request
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

  // Function to Fetch Listings from Backend
  const getListings = (user_token) => {
    fetch(`http://localhost:8000/housingapp/get-listings/?user_token=${user_token}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(async (data) => {
        const fetchedListings = data.content || [];
        setListings(fetchedListings);

        // Geocode Listings
        await geocodeListings(fetchedListings);
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        setError(error.message || "Failed to fetch listings"); // Optional
      });
  };

  // Function to Geocode Listings' Addresses
  const geocodeListings = async (listingsToGeocode) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps JavaScript API not loaded.");
      setError("Google Maps API not loaded.");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const geocodedListingsPromises = listingsToGeocode.map((listing) => {
      return new Promise((resolve) => {
        geocoder.geocode({ address: listing.address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              ...listing,
              latitude: location.lat(),
              longitude: location.lng(),
            });
          } else {
            console.error(`Geocode failed for address "${listing.address}": ${status}`);
            resolve({
              ...listing,
              latitude: null,
              longitude: null,
            });
          }
        });
      });
    });

    try {
      const geocodedListings = await Promise.all(geocodedListingsPromises);
      setGeocodedListings(geocodedListings);
    } catch (error) {
      console.error("Error during geocoding:", error);
      setError("Error during geocoding addresses.");
    }
  };

  // Function to Fetch Detailed Information for a Selected Listing
  const handleListingClick = async (listing) => {
    // If the clicked listing is already selected, close it by setting selectedListing to null
    if (selectedListing && parseInt(selectedListing.apt_id, 10) === parseInt(listing.apt_id, 10)) {
      setSelectedListing(null); // Close the details
      setActiveMarker(null); // Close the marker's info window
      return; // Exit early to avoid fetching details again
    }

    // Otherwise, fetch the details of the newly clicked listing
    setDetailsLoading(true);
    setDetailsError(null);

    try {
      const response = await fetch(`http://localhost:8000/housingapp/get-details/?apt_id=${listing.apt_id}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to load listing details.");
      }
      const data = await response.json();
      console.log('API Response:', data); // For debugging
      console.log('Status:', data.status);
      console.log('Content:', data.content);

      if (data.status && data.status.toLowerCase() === "success") { // Case-insensitive check
        const detailedListing = data.content;
        
        // Combine geocoded data
        const geocoded = geocodedListings.find((l) => parseInt(l.apt_id, 10) === parseInt(detailedListing.apt_id, 10));
        if (geocoded && geocoded.latitude && geocoded.longitude) {
          setSelectedListing({
            ...detailedListing,
            latitude: geocoded.latitude,
            longitude: geocoded.longitude,
          });
          setActiveMarker(listing.apt_id);

          // Pan and zoom the map to the selected listing
          if (mapRef.current) {
            mapRef.current.panTo({
              lat: geocoded.latitude,
              lng: geocoded.longitude,
            });
            mapRef.current.setZoom(16); // Adjust zoom level as desired
          }
        } else {
          console.error("Geocoded data not found for the selected listing.");
          setDetailsError("Listing does not have valid coordinates.");
        }
      } else {
        setDetailsError(data.message || "Failed to load listing details.");
      }
    } catch (error) {
      console.error("Error fetching listing details:", error);
      setDetailsError(error.message || "Failed to load listing details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Current Question
  const currentQ = questions[currentQIndex];

  // Google Map Styles
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const defaultCenter = {
    lat: 37.2296, // Blacksburg, VA coordinates
    lng: -80.4139,
  };

  // Inline Styles
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
      flexWrap: 'wrap', // Allows wrapping on smaller screens
    },
    listings: {
      flex: "1",
      minWidth: "300px",
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
      minWidth: "300px",
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
    infoWindowContent: {
      maxWidth: '200px',
    },
  };

  return (
    <div className="quiz-container" style={styles.quizContainer}>
      {!isCompleted ? (
        // Quiz Interface
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
        // Results Interface
        <div className="results-container" style={styles.resultsContainer}>
          {/* Listings Section */}
          <div className="listings" style={styles.listings}>
            <h2>Available Listings</h2>
            {geocodedListings.length > 0 ? (
              <ul style={{ padding: 0, listStyleType: 'none' }}>
                {geocodedListings.map((listing) => (
                  <li
                    key={listing.apt_id}
                    style={{
                      marginBottom: '20px',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer', // Indicates that the item is clickable
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      transition: 'background-color 0.3s ease',
                    }}
                    onClick={() => handleListingClick(listing)}
                    role="button" // Accessibility: Indicates that the element is interactive
                    tabIndex={0} // Makes the element focusable via keyboard
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleListingClick(listing);
                      }
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    aria-label={`View details for ${listing.address}`} // Accessibility: Descriptive label
                  >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {listing.address}
                    </p>
                    <p style={{ margin: 0 }}>
                      {listing.sq_ft} Sq Ft, {listing.num_rooms} Beds, {listing.num_bathrooms} Baths
                    </p>
                    
                    {/* Render Detailed Information */}
                    {selectedListing && parseInt(selectedListing.apt_id, 10) === parseInt(listing.apt_id, 10) && (
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

          {/* Map Section */}
          <div className="map" style={styles.map}>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={
                  selectedListing && selectedListing.latitude && selectedListing.longitude
                    ? { lat: selectedListing.latitude, lng: selectedListing.longitude }
                    : defaultCenter
                }
                zoom={selectedListing ? 14 : 12}
                onLoad={onMapLoad} // Set the map instance
              >
                {/* Render Markers */}
                {geocodedListings.map((listing) => (
                  listing.latitude && listing.longitude && (
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
                  )
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
