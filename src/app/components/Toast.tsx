import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Toast = ({ message }) => {
  return (
    <StyledWrapper>
      <div className="toast">
        <div className="toast-content">
          {message}
        </div>
        <div className="toast-icon">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M15.795 8.342l-5.909 9.545a1 1 0 0 1-1.628 0l-3.182-4.909a1 1 0 0 1 1.629-1.165l2.556 3.953L14.165 7.51a1 1 0 0 1 1.63 1.165z" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired, // Assure que `message` est une chaîne de caractères et est requis
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999; // S'assure que le toast est au-dessus des autres éléments
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;

  .toast {
    background-color: #333;
    color: #fff;
    padding: 10px 20px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideDown 0.3s ease-out; // Animation d'apparition
  }

  .toast-icon svg {
    width: 24px;
    height: 24px;
    fill: #fff;
  }

  .toast-content {
    font-family: Arial, sans-serif;
    font-size: 14px;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

export default Toast;
