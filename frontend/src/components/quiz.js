import React, { useState } from 'react';


const Home = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isCompleted, setIsCompleted] = useState(false);

    const questions = [
        {
            id: 1,
            question: "What is your preferred room type?",
            type: "single-choice",
            options: ["Single", "Double", "Triple"]
        },
        {
            id: 2,
            question: "Do you prefer a quiet dorm or a more social one?",
            type: "single-choice",
            options: ["Quiet", "Social"]
        },
        {
            id: 3,
            question: "Do you prefer a dorm close to campus facilities or off-campus?",
            type: "single-choice",
            options: ["Close to campus", "Off-campus"]
        },
        {
            id: 4,
            question: "Do you have any accessibility needs?",
            type: "single-choice",
            options: ["Yes", "No"]
        },
        {
            id: 5,
            question: "Do you prefer co-ed dorms or single-gender dorms?",
            type: "single-choice",
            options: ["Co-ed", "Single-gender"]
        }
    ];

    const handleAnswer = (answer) => {
        setAnswers({ ...answers, [currentQuestion]: answer });
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setIsCompleted(true);
            // You can handle the submission of answers here
            console.log('Quiz completed:', answers);
        }
    };

    const currentQ = questions[currentQuestion];

    return (
        <div className="quiz-container" style={styles.quizContainer}>
            {!isCompleted ? (
                <div className="question-card" style={styles.questionCard}>
                    <h2 style={styles.questionText}>{currentQ.question}</h2>
                    <div className="options" style={styles.optionsContainer}>
                        {currentQ.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                style={styles.optionButton}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="completion-message" style={styles.completionMessage}>
                    <h2>Thank you for completing the quiz!</h2>
                </div>
            )}
        </div>
    );
};

const styles = {
    quizContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        
    },
    questionCard: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        width: '80%',
        maxWidth: '500px',
        animation: 'fadeIn 0.5s',

        
    },
    questionText: {
        marginBottom: '1.5rem',
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        
    },
    optionButton: {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        backgroundColor: '#fff',
        transition: 'background-color 0.3s',
    },
    completionMessage: {
        textAlign: 'center',
        animation: 'fadeIn 0.5s',
    },
};

export default Home;
