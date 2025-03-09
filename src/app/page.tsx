"use client";

import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import DataCard from "./components/DataCard";
import Stats from "../app/models/Stats";

const HomeScreen = () => {
  const [nbrLivres, setNbrLivres] = useState(0);
  const [chiffreAffaire, setChiffreAffaire] = useState(0);

  useEffect(() => {
    const auteurId = localStorage.getItem("id"); // Récupérer l'ID de l'auteur

    if (auteurId) {
      Stats.nbr_livres(auteurId).then(setNbrLivres);
      Stats.chiffre_affaire(auteurId).then(setChiffreAffaire);
    }
  }, []);

  return (
    <div style={{margin: 0,padding:'48px 16px',flex:1,height:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{flex:0.9}}>
        <Header title="Acceuil" subTitle="Découvrez les performances de vos livres en un coup d’œil :"/>
        <div style={{display:'flex',justifyContent:'center',height:'65%',flexDirection:'column'}}>
          <div style={{flex:1,display:'flex',marginBottom:42}}>
            <DataCard dataTitle="Livres" dataDesc="Nombre de livres sur papers" dataValue={nbrLivres} />
            {/* <DataCard dataTitle="Transactions" dataDesc="Nombre de transactions sur papers" dataValue="11" /> */}
            <DataCard dataTitle="Chiffre " dataDesc="montant total sur papers" dataValue={`${chiffreAffaire}F`} />
          </div>
          <div style={{flex:1,display:'flex'}}>
            {/* <DataCard dataTitle="Avis" dataDesc="Avis sur vos oeuvres" dataValue="05" /> */}
            
          </div>
        </div>
      </div>
      <Footer active={"home"} />
    </div>
  );
};

export default HomeScreen;