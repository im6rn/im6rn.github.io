import React, { useState, useEffect } from "react";

const QuizWithGUI = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState({
    livingPreference: "",
    roomType: "",
    pricePoint: "",
    maxPrice: "",
    furnished: ""
  });
  /*
  0 -> 1:7
  0 -> 8
  */
  const questions = [
    {
        id: 1,
        question: "Are you a freshman?",
        options: ["Yes", "No"],
        type: "single",
        key: "on_campus",
    },
    {
        id: 2,
        question: "What's your desired price point?",
        options: ["<$500", "~$1000", "~$1500", "$2000+"],
        type: "single",
        key: "desired_price",
    },
    {
        id: 3,
        question: "Do you want utilities included in the price?",
        options: ["Yes", "No"],
        type: "single",
        key: "utilities_included",
    },
    {
        id: 4,
        question: "How many bedrooms do you want?",
        options: ["1", "2", "3", "4"],
        type: "single",
        key: "desired_bedrooms",
    },
    {
        id: 5,
        question: "How many bathrooms do you want?",
        options: ["1", "2", "3", "4"],
        type: "single",
        key: "desired_bathrooms",
    },
    {
        id: 6,
        question: "What amenities would you like?",
        options: [" Parking", " EV charger", " Gym", " Internet", " Animal-Friendly", " In-unit washer/dryer", " Balcony"],
        type: "multiple",
        key: "desired_amenities",
    },
    {
        id: 7,
        question: "Do you need access to public transit?",
        options: ["Yes", "No"],
        type: "single",
        key: "public_transit",
    },
    /** ON CAMPUS QUESTIONS START HERE */
    {
        id: 8,
        question: "Do you want air conditioning in your room?",
        options: ["Yes", "No"],
        type: "single",
        key: "ac",
    },
    {
        id: 9,
        question: "Do you want to be in a traditional or suite-style room?",
        options: ["Traditional", "Suite-style"],
        type: "single",
        key: "room_style"
    },
    {
        id: 10,
        question: "Would you like to be in a Living Learning Community?",
        options: ["Yes", "No"],
        type: "single",
        key: "living_learning_community",
    },
    {
        id: 11,
        question: "Would you like to be in an academic LLC or identity LLC?",
        options: ["Academic", "Identity"],
        type: "single",
        key: "llc_type"
    },
    {
        id: 12,
        question: "What type of academic LLC would you like to be in?",
        options: ["Honors", "Leadership", "IT", "Engineering", "Education", "Data Analytics", "Cybersecurity", "Entreprenurship", "Arts", "Language", "Sciences", "Major Exploration"],
        type: "single",
        key: "academic_llc_type"
    },
    {
        id: 13,
        question: "What type of personal LLC would you like to be in?",
        options: ["Interfaith", "First-Gen", "Growth", "Global Perspectives", "LGBTQ+", "Well-Being", "Recovery", "Black Culture", "Transfer Students", "Fraternities", "Sororities"],
        type: "single",
        key: "personal_llc_type"
    }
  ];

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQIndex];
    if (currentQuestion.id === 1) {
        setAnswers({ ...answers, livingPreference: answer });
        // Move to next question based on the user's living preference
        if (answer === "Yes") {
          // If on-campus, directly submit answers (or add custom on-campus questions)
          setCurrentQIndex(8);
        } else {
          // Continue with the off-campus related questions
          setCurrentQIndex(2);
        }
    }
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
    const nextQIndex = currentQIndex + 1;
    if (nextQIndex < questions.length) {
      setCurrentQIndex(nextQIndex);
    } else {
      setIsCompleted(true);
    }
  };
  

  const currentQ = questions[currentQIndex];

  const styles = {
    quizContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f4f9",
      padding: "20px"
    },
    questionCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      width: "100%",
      textAlign: "center"
    },
    questionText: {
      fontSize: "24px",
      marginBottom: "20px"
    },
    optionsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    optionButton: {
      padding: "10px 20px",
      fontSize: "18px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    },
    optionButtonHover: {
      backgroundColor: "#0056b3"
    },
    completionMessage: {
      textAlign: "center",
      fontSize: "22px",
      padding: "20px",
      backgroundColor: "#d4edda",
      borderRadius: "8px"
    }
  };
  const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);


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
                          setMultiSelectAnswers([...multiSelectAnswers, option]);
                        } else {
                          setMultiSelectAnswers(
                            multiSelectAnswers.filter((o) => o !== option)
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
          {/* Handle displaying results here */}
        </div>
      )}
    </div>
  );  
};



// POST request with results in JSON 
// GET request for apt listings & seperate GET for apt details

export default QuizWithGUI;
