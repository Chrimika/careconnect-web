"use client";

import React from 'react';
import { Specialites } from '../src/app/datas/specialities';
import { useNavigate } from 'react-router-dom';
import { FiBell } from 'react-icons/fi';
import logo from '../assets/images/logo.png';
import doctorHero from '../assets/images/doctorHero.png';
import Image from 'next/image';

const HomeScreen = () => {
  const navigate = useNavigate();

  const renderItem = (item) => {
    if (!item.imageRepresentatif || !item.nom) {
      return null;
    }

    return (
      <div
        key={item.id}
        className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col items-center mx-2 shadow-md"
        onClick={() => navigate(`/speciality/${item.id}`, { state: { item } })}
      >
        <img
          src={item.imageRepresentatif}
          alt={item.nom}
          className="w-20 h-20 rounded-full object-cover"
        />
        <p className="mt-2 text-center text-sm font-semibold">{item.nom}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0bcb95] py-4">
        <div className="flex justify-between items-center px-4">
          <Image src={logo} alt="Logo" className="w-10 h-10" />
          <FiBell className="text-white text-2xl" />
        </div>
        <div className="px-4 mt-4">
          <h1 className="text-white text-2xl font-medium">Hosto au piol</h1>
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
        <div className="mt-4 flex overflow-x-auto scrollbar-hide">
          {Specialites.map(renderItem)}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center">
          <div className="bg-[#0bcb95] w-1 h-5"></div>
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Généraliste</h2>
        </div>
        <div className="mt-4 flex">
          <Image
            src={doctorHero}
            alt="Doctor Hero"
            className="flex-1 object-contain"
          />
          <div className="flex-1 flex flex-col justify-center px-4">
            <button
              onClick={() => navigate('/consultations')}
              className="bg-[#0bcb95] text-white font-bold text-lg py-2 px-4 rounded-md shadow-md"
            >
              Consulter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
