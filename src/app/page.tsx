"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Specialites } from "./datas/specialities";
import { FiBell, FiFile, FiUser } from "react-icons/fi";
import logo from "./assets/images/logo.png";
import doctorHero from "./assets/images/doctorHero.png";
import Footer from "./components/Footer";
import Header from "./components/Header";
import DataCard from "./components/DataCard";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <div style={{margin: 0,padding:'48px 16px',flex:1,height:'100vh',display:'flex',flexDirection:'column'}}>
      <div style={{flex:0.9}}>
        <Header title="Acceuil" subTitle="Découvrez les performances de vos livres en un coup d’œil :"/>
        <div style={{display:'flex',justifyContent:'center',height:'65%',flexDirection:'column'}}>
          <div style={{flex:1,display:'flex',marginBottom:42}}>
            <DataCard dataTitle="Livres" dataDesc="Nombre de livres sur papers" dataValue="05" />
            <DataCard dataTitle="Transactions" dataDesc="Nombre de transactions sur papers" dataValue="11" />
          </div>
          <div style={{flex:1,display:'flex'}}>
            <DataCard dataTitle="Avis" dataDesc="Avis sur vos oeuvres" dataValue="05" />
            <DataCard dataTitle="Chiffre " dataDesc="montant total sur papers" dataValue="102K" />
          </div>
        </div>
      </div>
      <Footer active={"home"} />
    </div>
  );
};

export default HomeScreen;
