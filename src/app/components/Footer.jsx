"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import home from "../assets/images/home.png";
import coin from "../assets/images/coin.png";
import book from "../assets/images/book.png";
import user from "../assets/images/userNav.png";
import wallet from "../assets/images/wallet.png";
import homeActive from "../assets/images/home-active.png";
import coinActive from "../assets/images/coin-active.png";
import bookActive from "../assets/images/book-active.png";
import userActive from "../assets/images/userNav-active.png";
import walletActive from "../assets/images/wallet-active.png";

const Button = ({ active }) => {
  const router = useRouter();

  return (
    <StyledWrapper>
      <div className="button-container">
        <button onClick={() => router.push("../Stats/")} className={`button ${active === "home" ? "active" : ""}`}>
          <Image src={active == "home" ? homeActive : home} alt="Accueil" className="icon" />
          <span className="legend">Accueil</span>
        </button>

        <button onClick={() => router.push("../Ventes/")} className={`button ${active === "coin" ? "active" : ""}`}>
          <Image src={active === "coin" ? coinActive : coin} alt="Consultations" className="icon" />
          <span className="legend">Ventes</span>
        </button>

        <button onClick={() => router.push("../Livres/")} className={`button ${active === "book" ? "active" : ""}`}>
          <Image src={active === "book" ? bookActive : book} alt="Notifications" className="icon" />
          <span className="legend">Livres</span>
        </button>

        <button onClick={() => router.push("../Profile/")} className={`button ${active === "user" ? "active" : ""}`}>
          <Image src={active === "user" ? userActive : user} alt="Profile" className="icon" />
          <span className="legend">Profile</span>
        </button>

        <button onClick={() => router.push("../Payment/")} className={`button ${active === "wallet" ? "active" : ""}`}>
          <Image src={active === "wallet" ? walletActive : wallet} alt="Wallet" className="icon" />
          <span className="legend">Paiements</span>
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
  flex:0.2;

  .button-container {
    display: flex;
    background-color: #f3f3f3;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    height: 60px;
    align-items: center;
    justify-content: space-around;
    border-radius: 20px;
  }

  .legend {
    font-size: 10px;
  }

  .button {
    outline: 0 !important;
    border: 0 !important;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c3c3c3;
    transition: all ease-in-out 0.3s;
    cursor: pointer;
    flex-direction: column;
  }

  .button:hover {
    transform: translateY(-3px);
  }

  .button.active {
    color: #0CC0DF;
  }

  .icon {
    width: 24px;
    height: 24px;
  }
`;

export default Button;
