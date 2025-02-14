"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Specialites } from "./datas/specialities";
import { FiBell, FiFile, FiUser } from "react-icons/fi";
import logo from "./assets/images/logo.png";
import doctorHero from "./assets/images/doctorHero.png";
import Footer from "./components/Footer";

const HomeScreen = () => {
  const router = useRouter();

  const renderItem = (item) => {
    if (!item.imageRepresentatif || !item.nom) {
      return null;
    }

    return (
      <div
        key={item.id}
        style={{
          padding: '30px',
          borderWidth: 1,
          marginRight: 16,
          borderRadius: 8,
          width: '300px', 
          boxSizing: 'border-box', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onClick={() => router.push(`/speciality/${item.id}`)}
      >
        <img
          src={item.imageRepresentatif}
          alt={item.nom}
          style={{}}
          className="h-20 rounded-full object-cover"
        />
        <p className="mt-2 text-center text-sm font-semibold">{item.nom}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <header className="bg-[#0bcb95] py-4">
        <div className="flex justify-between items-center px-4">
          <Image src={logo} alt="Logo" className="w-10 h-10" />
          
          <button
        onClick={() => router.push("./../")}
        >
          <FiUser className="text-white text-2xl" />
        </button>
        </div>
        <div className="px-4 mt-4">
          <h1 className="text-white text-2xl font-medium">Care Connect</h1>
          <p className="text-white text-sm">
            Consultez un médecin ou accédez aux soins facilement, où que vous soyez !
          </p>
        </div>
      </header>

      <section className="mt-6 px-4">
        <div className="flex items-center">
          <div className="bg-[#0bcb95] w-1 h-5"></div>
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Spécialités</h2>
        </div>
        <div
          style={{
            WebkitOverflowScrolling: 'touch', // Pour un défilement fluide sur iOS
            overflowX: 'scroll', // Active le scroll horizontal
            scrollbarWidth: 'none', // Cacher la scrollbar dans Firefox
          }}
          className="mt-4 flex overflow-x-auto scrollbar-hide"
        >
          {Specialites.map(renderItem)}
        </div>

      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center">
          <div className="bg-[#0bcb95] w-1 h-5"></div>
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Généraliste</h2>
        </div>
        <div className="mt-4 flex flex-col items-center">
          <Image
            src={doctorHero}
            alt="Doctor Hero"
            className="w-full max-w-xs object-contain"
          />
          <div style={{}} className="w-full mt-4 flex justify-center">
            {/* <button
              onClick={() => router.push("./Consultations/")}
              className="bg-[#0bcb95] text-white font-bold text-lg py-2 px-6 rounded-md shadow-md w-full"
            >
              Consulter
            </button> */}
          </div>
        </div>
      </section>
      <Footer active={"home"} />
    </div>
  );
};

export default HomeScreen;
