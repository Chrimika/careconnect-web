"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiBell, FiCalendar, FiEdit } from "react-icons/fi";
import logo from "../assets/images/logo.png";

const HomeDoctor = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    "Réunion avec la direction à 14h",
    "Mise à jour des protocoles COVID",
    "Nouvelle patiente ajoutée à votre planning",
  ]);
  const [appointments, setAppointments] = useState([
    { id: 1, patient: "Alice Dupont", time: "09:00", date: "26/01/2025" },
    { id: 2, patient: "Jean Martin", time: "11:30", date: "26/01/2025" },
    { id: 3, patient: "Marie Lemoine", time: "14:00", date: "26/01/2025" },
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#0bcb95] py-4">
        <div className="flex justify-between items-center px-4">
          <Image src={logo} alt="Logo" className="w-10 h-10" />
          <FiBell className="text-white text-2xl" />
        </div>
        <div className="px-4 mt-4">
          <h1 className="text-white text-2xl font-medium">Espace Médecin</h1>
          <p className="text-white text-sm">
            Gérez vos rendez-vous et votre emploi du temps facilement.
          </p>
        </div>
      </header>

      {/* Notifications */}
      <section className="mt-6 px-4">
        <div className="flex items-center">
          <FiBell className="text-[#0bcb95] text-lg" />
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Notifications</h2>
        </div>
        <ul className="mt-4 space-y-2">
          {notifications.map((notif, index) => (
            <li key={index} className="text-sm text-gray-600">
              - {notif}
            </li>
          ))}
        </ul>
      </section>

      {/* Appointments */}
      <section className="mt-6 px-4">
        <div className="flex items-center">
          <FiCalendar className="text-[#0bcb95] text-lg" />
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Rendez-vous</h2>
        </div>
        <ul className="mt-4 space-y-2">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="flex justify-between items-center border p-2 rounded-lg shadow-sm"
            >
              <span>
                {appointment.date} à {appointment.time} - {appointment.patient}
              </span>
              <button
                className="text-sm text-[#0bcb95] underline"
                onClick={() => router.push(`/appointments/${appointment.id}`)}
              >
                Détails
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Update Schedule */}
      <section className="mt-6 px-4">
        <div className="flex items-center">
          <FiEdit className="text-[#0bcb95] text-lg" />
          <h2 className="ml-2 text-lg font-semibold text-gray-800">Emploi du temps</h2>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push("/schedule/update")}
            className="bg-[#0bcb95] text-white font-bold text-lg py-2 px-6 rounded-md shadow-md w-full"
          >
            Mettre à jour
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeDoctor;
