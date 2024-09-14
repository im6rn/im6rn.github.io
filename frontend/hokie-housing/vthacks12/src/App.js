import React from 'react';
import styled from 'styled-components';

const SplashContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #ff5f6d, #ffc371);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Heading = styled.h1`
  font-size: 3em;
  color: #fff;
  text-align: center;
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const ScrollIndicator = styled.p`
  margin-top: 20px;
  color: #fff;
  font-size: 1.2em;
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
`;

function SplashScreen() {
  return (
    <SplashContainer>
      <Heading>
        hokie housing, <BoldText>made simple.</BoldText>
      </Heading>
      <ScrollIndicator>▼ Scroll Down to Start Quiz ▼</ScrollIndicator>
    </SplashContainer>
  );
}

export default SplashScreen;
