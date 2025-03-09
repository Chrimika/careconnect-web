import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper className="loading-content" style={{borderWidth:1,zIndex:1000,justifyContent:'center',alignItems:'center',backgroundColor: 'rgba(0, 0, 0, 0.8)',width:'100%', height:'100%',position: 'fixed',top: 0, left: 0,display:'none'}}>
      <div className="loading">
        <svg width="64px" height="48px">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loading svg polyline {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .loading svg polyline#back {
    fill: none;
    stroke: #0bcb95;
    opacity: 0.4;
  }

  .loading svg polyline#front {
    fill: none;
    stroke: #0bcb95;
    stroke-dasharray: 48, 144;
    stroke-dashoffset: 192;
    animation: dash_682 1.4s linear infinite;
  }

  @keyframes dash_682 {
    72.5% {
      opacity: 0;
    }

    to {
      stroke-dashoffset: 0;
    }
  }`;

export default Loader;
