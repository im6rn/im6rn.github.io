import React, { useState, useEffect } from "react";

const QuizWithGUI = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [listings, setListings] = useState(null);
  const [answers, setAnswers] = useState({});
  const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);

  const questions = [
    {
      id: 0,
      question: "Are you a freshman?",
      options: ["Yes", "No"],
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
        " Parking",
        " EV charger",
        " Gym",
        " Internet",
        " Animal-Friendly",
        " Washer/Dryer",
        " Balcony",
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
    {
      id: 7,
      question: "Do you want air conditioning in your room?",
      options: ["Yes", "No"],
      type: "single",
      key: "ac",
    },
    {
      id: 8,
      question: "Do you want to be in a traditional or suite-style room?",
      options: ["Traditional", "Suite-style"],
      type: "single",
      key: "room_style",
    },
    {
      id: 9,
      question: "Would you like to be in a Living Learning Community?",
      options: ["Yes", "No"],
      type: "single",
      key: "living_learning_community",
    },
    {
      id: 10,
      question: "Would you like to be in an academic LLC or identity LLC?",
      options: ["Academic", "Identity"],
      type: "single",
      key: "llc_type",
    },
    {
      id: 11,
      question: "What type of academic LLC would you like to be in?",
      options: [
        "Honors",
        "Leadership",
        "IT",
        "Engineering",
        "Education",
        "Data Analytics",
        "Cybersecurity",
        "Entrepreneurship",
        "Arts",
        "Language",
        "Sciences",
        "Major Exploration",
      ],
      type: "single",
      key: "academic_llc_type",
    },
    {
      id: 12,
      question: "What type of personal LLC would you like to be in?",
      options: [
        "Interfaith",
        "First-Gen",
        "Growth",
        "Global Perspectives",
        "LGBTQ+",
        "Well-Being",
        "Recovery",
        "Black Culture",
        "Transfer Students",
        "Fraternities",
        "Sororities",
      ],
      type: "single",
      key: "personal_llc_type",
    },
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
        // You can map price ranges to numeric values as needed
        if (answer === "<$500") formattedAnswer = 500;
        else if (answer === "~$1000") formattedAnswer = 1000;
        else if (answer === "~$1500") formattedAnswer = 1500;
        else if (answer === "$2000+") formattedAnswer = 2000;
    } else if (currentQuestion.key === "desired_bedrooms" || currentQuestion.key === "desired_bathrooms") {
            // Convert bedrooms/bathrooms to integer
            formattedAnswer = parseInt(answer, 10);
    }

    // Save the answer to the current question
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.key]: formattedAnswer,
    }));

    let nextQIndex = currentQIndex + 1;

    // Conditional logic based on current question
    if (currentQuestion.id === 0) {
      // First question: "Are you a freshman?"
      if (answer === "Yes") {
        // Freshmen live on-campus, skip to on-campus questions starting from id:7
        /*nextQIndex = questions.findIndex((q) => q.id === 7);*/
      } else {
        // Not a freshman, proceed to off-campus questions
        nextQIndex = currentQIndex + 1;
      }
    } else if (currentQuestion.id === 8 ) {
      setIsCompleted(true);
      return;
    } else if (currentQuestion.id === 9) {
      // Question: "Would you like to be in a Living Learning Community?"
      if (answer === "No") {
        // Skip LLC questions, end quiz
        setIsCompleted(true);
        return;
      }
    } else if (currentQuestion.id === 10) {
      // Question: "Would you like to be in an academic LLC or identity LLC?"
      if (answer === "Academic") {
        // Proceed to academic LLC question
        nextQIndex = questions.findIndex((q) => q.id === 11);
      } else if (answer === "Identity") {
        // Proceed to personal LLC question
        nextQIndex = questions.findIndex((q) => q.id === 12);
      }
    } else if (currentQuestion.id === 11 || currentQuestion.id === 12) {
      // After these questions, the quiz is completed
      setIsCompleted(true);
      return;
    }

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
      getListings();
    }
  }, [isCompleted]);


  // Function to submit answers via POST request
  const submitAnswers = () => {
    const postData = {
        on_campus: answers.is_freshman === "Yes", // True if freshman, implying on-campus
        //in_suite_bath: answers.room_style === "Suite-style" ? true : false,
        desired_price: answers.desired_price !== undefined ? answers.desired_price : null,
        utilities_included: answers.utilities_included !== undefined ? answers.utilities_included : null,
        //living_learning_community: answers.living_learning_community || null,
        airConditioning: answers.airConditioning !== undefined ? answers.airConditioning : null,
        public_transport: answers.public_transit !== undefined ? answers.public_transit : null,
        desired_amenities: answers.desired_amenities || [],
        furnished: answers.furnished !== undefined ? answers.furnished : null,
        desired_bathrooms: answers.desired_bathrooms !== undefined ? answers.desired_bathrooms : null,
        desired_bedrooms: answers.desired_bedrooms !== undefined ? answers.desired_bedrooms : null,
      };
    // POST the structured data
  fetch("http://localhost:3000/backend/hokiehousing/housingapp/quiz-submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => response.json())
    .then((data) => {
        setUserToken(data.user_token);  
        getListings(data.user_token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const currentQ = questions[currentQIndex];

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
  };
  const [userToken, setUserToken] = useState(null);
    // When you ping the get_apartment_listings endpoint, pass the user_token via query parameter
  // Function to fetch listings from backend
  const getListings = (user_token) => {
    fetch(`http://localhost:3000/backend/hokiehousing/housingapp/get-listings?user_token=${user_token}`)
      .then((response) => response.json())
      .then((data) => {
        setListings(data);  // Set the listings in state
      })
      .catch((error) => {
        console.error("Error fetching listings:", error);
        // You can set an error state here if needed
      });
  };
  
  return (
    <div className="quiz-container" style={styles.quizContainer}>
      {!isCompleted ? (
        <div className="question-card" style={styles.questionCard}>
          <h2 style={styles.questionText}>{currentQ.question}</h2>
          <div className="options" style={styles.optionsContainer}>
            {currentQ.type === "multiple" ? (
              <>
                {currentQ.options.map((option, index) => (
                  <label key={index}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={multiSelectAnswers.includes(option)}
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
                    />
                    {option}
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
        <div className="completion-message" style={styles.completionMessage}>
          <h2>Based on your preferences, these are the best for you:</h2>
          {listings ? (
            listings.length > 0 ? (
              <ul>
                {listings.map((listing, index) => (
                  <li key={index}>
                    <h3>{listing.name}</h3>
                    <p>{listing.description}</p>
                    {/* Add more listing details as needed */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No listings found matching your preferences.</p>
            )
          ) : (
            <p>Loading listings...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizWithGUI;
