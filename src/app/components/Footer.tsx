"use client"

import { useRouter } from "next/navigation";
import React from 'react';
import styled from 'styled-components';

const Button = ({ active }) => {
  const router = useRouter();
  return (
    <StyledWrapper>
      <div className="button-container">
        <button onClick={() => router.push("../")} className={`button ${active === 'home' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg>
          <span className="legend">Accueil</span>
        </button>

        <button onClick={() => router.push("./Consultations/")} className={`button ${active === 'consult' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon">
            <path d="M1.8 12s3.2-7 10.2-7 10.2 7 10.2 7-3.2 7-10.2 7S1.8 12 1.8 12z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={12} cy={12} r={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="legend">Consultations</span>
        </button>

        <button onClick={() => router.push("./Login/")} className={`button ${active === 'notifications' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" aria-hidden="true" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon">
            <path d="M15.8 17H8.2c-1.68 0-3.12-1.2-3.44-2.84L4 12V9a8 8 0 0 1 16 0v3l-.76 2.16c-.32 1.64-1.76 2.84-3.44 2.84z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="legend">Notifications</span>
        </button>

        <button className={`button ${active === 'profile' ? 'active' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
          </svg>
          <span className="legend">Profile</span>
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  z-index: 1000;

  .button-container {
    display: flex;
    background-color: #F9F9F9;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    height: 60px;
    align-items: center;
    justify-content: space-around;
    border-radius: 15px 15px 0 0;
  }

  .legend {
    font-size: 10px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0bcb95;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
    flex-direction: column;
  }

  .button:hover {
    transform: translateY(-3px);
  }

  .button.active {
    background-color: #e6f9f3;
    color: #007f5f;
  }

  .icon {
    font-size: 24px;
  }
`;

export default Button;
