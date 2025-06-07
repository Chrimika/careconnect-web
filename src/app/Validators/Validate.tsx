"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ValidationAuteurs from "../models/ValidationAuteurs";

type AuteurType = {
  id: string;
  NomPrenom?: string;
  email?: string;
  ville?: string;
  metier?: string;
  date?: string | { seconds: number };
  tel?: string;
  nationalite?: string;
  avezVousDejaEcris?: string;
  titreLivre?: string;
  solde?: number;
  description?: string;
  courteDescription?: string;
  password_visible?: string;
  // Ajoute d'autres champs si besoin
};

function formatDate(date: string | { seconds: number } | undefined): string {
  if (!date) return "";
  if (typeof date === "string") return new Date(date).toLocaleString("fr-FR");
  if (typeof date === "object" && "seconds" in date)
    return new Date(date.seconds * 1000).toLocaleString("fr-FR");
  return "";
}

export default function ValidatePage() {
  const [auteurs, setAuteurs] = useState<AuteurType[]>([]);
  const [filter, setFilter] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAuteur, setSelectedAuteur] = useState<AuteurType | null>(null);
  const router = useRouter();

  // Protection d'accès
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isValidator = localStorage.getItem("isValidator");
      if (isValidator !== "true") {
        router.replace("/"); // Redirige vers la page de login si non autorisé
      }
    }
  }, [router]);

  // Charger les auteurs
  const fetchAuteurs = async () => {
    setLoading(true);
    const data = await ValidationAuteurs.getAuteurs();
    setAuteurs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAuteurs();
    // eslint-disable-next-line
  }, []);

  // Filtrage côté client sur plusieurs champs
  const auteursFiltres = auteurs.filter((auteur: AuteurType) => {
    const search = filter.toLowerCase();
    return (
      auteur.NomPrenom?.toLowerCase().includes(search) ||
      auteur.email?.toLowerCase().includes(search) ||
      auteur.ville?.toLowerCase().includes(search) ||
      auteur.metier?.toLowerCase().includes(search)
    );
  });

  // Envoyer accès par email
  const handleSendAccess = async (auteur: AuteurType) => {
    const ok = await ValidationAuteurs.sendAccessByEmail(auteur);
    alert(ok ? "Accès envoyé !" : "Erreur lors de l'envoi.");
  };

  // Notifier un auteur
  const handleNotify = async (auteur: AuteurType) => {
    if (!notifMsg) return;
    await ValidationAuteurs.notifyAuteur(auteur.id, { message: notifMsg });
    alert("Notification envoyée !");
    setNotifMsg("");
  };

  // Notifier tous les auteurs
  const handleNotifyAll = async () => {
    if (!notifMsg) return;
    await ValidationAuteurs.notifyAllAuteurs({ message: notifMsg });
    alert("Notification envoyée à tous !");
    setNotifMsg("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Validation des Auteurs</h1>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Filtrer par nom, prénom, email, ville, métier..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        />
        <button onClick={fetchAuteurs} className="bg-blue-500 text-white px-4 py-1 rounded">
          Rafraîchir
        </button>
      </div>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Message de notification"
          value={notifMsg}
          onChange={(e) => setNotifMsg(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        />
        <button onClick={handleNotifyAll} className="bg-green-600 text-white px-4 py-1 rounded">
          Notifier tous
        </button>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Ville</th>
              <th className="border px-2 py-1">Métier</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auteursFiltres.map((auteur: AuteurType) => (
              <tr key={auteur.id} className="hover:bg-blue-50 cursor-pointer">
                <td className="border px-2 py-1" onClick={() => setSelectedAuteur(auteur)}>{auteur.NomPrenom}</td>
                <td className="border px-2 py-1" onClick={() => setSelectedAuteur(auteur)}>{auteur.email}</td>
                <td className="border px-2 py-1" onClick={() => setSelectedAuteur(auteur)}>{auteur.ville}</td>
                <td className="border px-2 py-1" onClick={() => setSelectedAuteur(auteur)}>{auteur.metier}</td>
                <td className="border px-2 py-1" onClick={() => setSelectedAuteur(auteur)}>{formatDate(auteur.date)}</td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    onClick={() => handleSendAccess(auteur)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Envoyer accès
                  </button>
                  <button
                    onClick={() => handleNotify(auteur)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Notifier
                  </button>
                </td>
              </tr>
            ))}
            {auteursFiltres.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Aucun auteur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal d'informations complémentaires */}
      {selectedAuteur && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedAuteur(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">{selectedAuteur.NomPrenom}</h2>
            <div className="mb-2"><b>Email :</b> {selectedAuteur.email}</div>
            <div className="mb-2"><b>Téléphone :</b> {selectedAuteur.tel}</div>
            <div className="mb-2"><b>Ville :</b> {selectedAuteur.ville}</div>
            <div className="mb-2"><b>Métier :</b> {selectedAuteur.metier}</div>
            <div className="mb-2"><b>Nationalité :</b> {selectedAuteur.nationalite}</div>
            <div className="mb-2"><b>A déjà écrit ?</b> {selectedAuteur.avezVousDejaEcris}</div>
            <div className="mb-2"><b>Titre du livre :</b> {selectedAuteur.titreLivre}</div>
            <div className="mb-2"><b>Solde :</b> {selectedAuteur.solde}</div>
            <div className="mb-2"><b>Date dinscription :</b> {formatDate(selectedAuteur.date)}</div>
            <div className="mb-2"><b>Description :</b> {selectedAuteur.description}</div>
            <div className="mb-2"><b>Courte description :</b> {selectedAuteur.courteDescription}</div>
            <div className="mb-2"><b>Mot de passe visible :</b> {selectedAuteur.password_visible}</div>
            {/* Ajoute d'autres champs si besoin */}
          </div>
        </div>
      )}
    </div>
  );
}
