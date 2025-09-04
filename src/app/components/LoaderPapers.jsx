"use client";

import React from "react";
import styled from "styled-components";

const Loader = ({ color = "#0cc0cd" }) => {
  return (
    <StyledWrapper color={color}>
      <div className="loader">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`bar${i + 1}`} />
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: rgba(255, 255, 255, 0.8);

  .loader {
    position: relative;
    width: 54px;
    height: 54px;
    border-radius: 10px;
  }

  .loader div {
    width: 8%;
    height: 24%;
    background: ${({ color }) => color}; 
    position: absolute;
    left: 50%;
    top: 30%;
    opacity: 0;
    border-radius: 50px;
    box-shadow: 0 0 3px ${({ color }) => color}; 
    animation: fade458 1s linear infinite;
  }

  @keyframes fade458 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.25;
    }
  }

  ${Array.from({ length: 12 }, (_, i) => `
    .loader .bar${i + 1} {
      transform: rotate(${i * 30}deg) translate(0, -130%);
      animation-delay: ${-1 + i * 0.1}s;
    }
  `).join("")}
`;

export default Loader;
