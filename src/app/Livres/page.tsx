"use client";
import React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Livres = () => {
    return(
        <div style={{margin: 0,padding:'48px 16px',flex:1,height:'100vh',display:'flex',flexDirection:'column'}}>
            <div style={{flex:0.9,border:'1px solid black'}}>
            <Header title="Livres" subTitle="Créez. Gérez. Publiez
Publiez un nouvel ouvrage en cliquant sur Créer. ou gerez vos oeuvre existantes depuis votre bibliothèque ci-dessous"/>
            </div>
            <Footer active={"book"} />
        </div>
    )
}

export default Livres;