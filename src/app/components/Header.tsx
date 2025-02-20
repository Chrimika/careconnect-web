"use client"

import React from "react";
import styled from "styled-components";

const Header = ({ title, subTitle }) => {
  return (
    <HeaderWrapper>
      <h1>{title}</h1>
      <div className="underline"></div>
      <p className="subtitle">{subTitle}</p>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  h1 {
    font-size: 2rem;
  }

  .underline {
    width: 60px;
    height: 6px;
    background-color: #0cc0df;
    border-radius: 15px;
    margin-top: -4px;
  }

  .subtitle {
    font-size: 1rem;
    width: 300px;
    line-height: 1.1;
    color: #808080;
    margin: 23px 0;
  }
`;

export default Header;
