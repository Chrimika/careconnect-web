"use client";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";

const Profile = () => {
  return (
    <div
      style={{
        margin: 0,
        padding: "48px 16px",
        flex: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div style={{ flex: 0.9, border: "1px solid black" }}>
        <Header title="Profile" subTitle="" />
        <div style={{ marginTop: 32 }}>
          {/* Utilisation correcte de next/image */}
          <Image
            src="/assets/images/logo.png" // Utilisation correcte du chemin (relatif à partir de public)
            alt="Logo"
            width={500}
            height={300}
            priority // optionnel, permet de prioriser le chargement de l'image
          />
        </div>
      </div>
      <Footer active={"user"} />
    </div>
  );
};

export default Profile;
