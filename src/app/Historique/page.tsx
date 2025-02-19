"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { FiChevronLeft } from "react-icons/fi";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import icone from "../assets/images/medical-report.png";
import Image from "next/image";

interface Consultation {
  id: string;
  date: any; // Timestamp Firestore ou string représentant une date
  heure: string;
  nomPatient: string;
  prenomPatient: string;
  typeConsultation: string;
  prix: number;
  pdfUrl: string;
  etat?: string; // "canceled" pour un rendez-vous annulé
}

// Fonction pour mettre en majuscule la première lettre d'une chaîne
const capitalizeFirstLetter = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export default function Page() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchConsultations = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Consultations"));
        const data: Consultation[] = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Consultation[];

        // Tri par date décroissante (les plus récentes en tête)
        data.sort((a, b) => {
          const dateA: Date = a.date?.toDate ? a.date.toDate() : new Date(a.date);
          const dateB: Date = b.date?.toDate ? b.date.toDate() : new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        if (isMounted) {
          setConsultations(data);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Requête annulée");
        } else {
          console.error("Erreur lors de la récupération des consultations:", error);
        }
      }
    };

    fetchConsultations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fonction pour formater la date en "Lundi 15 février"
  const formatDate = (dateValue: any): string => {
    const dateObj: Date = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue);
    const formattedDate: string = format(dateObj, "EEEE d MMMM", { locale: fr });
    return capitalizeFirstLetter(formattedDate);
  };

  // Fonction pour annuler le rendez-vous (mettre à jour l'attribut "etat" à "canceled")
  const handleCancelConsultation = async () => {
    if (selectedConsultation) {
      const confirmCancel = window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous ?");
      if (!confirmCancel) return;

      try {
        await updateDoc(doc(firestore, "Consultations", selectedConsultation.id), {
          etat: "canceled",
        });
        // Mettre à jour l'état local : on peut par exemple mettre à jour la consultation annulée
        setConsultations((prev) =>
          prev.map((cons) =>
            cons.id === selectedConsultation.id ? { ...cons, etat: "canceled" } : cons
          )
        );
        // On ferme la modal
        setSelectedConsultation(null);
      } catch (error) {
        console.error("Erreur lors de l'annulation du rendez-vous :", error);
        alert("Erreur lors de l'annulation du rendez-vous.");
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "24px",
        flex: 1,
        height: "100vh",
      }}
    >
      {/* Header */}
      <div style={{ padding: "0 16px", width: "100%" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => router.push("./../Consultations")}>
            <FiChevronLeft size={40} style={{ marginLeft: -16 }} />
          </button>
        </div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#1d1d1d",
            marginBottom: "12px",
          }}
        >
          Vos Consultations
        </h1>
      </div>

      {/* Liste des consultations */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {consultations.length === 0 ? (
          <p>Aucune consultation disponible.</p>
        ) : (
          consultations.map((consultation) => {
            const displayDate = formatDate(consultation.date);

            return (
              <div
                key={consultation.id}
                style={{ padding: "12px", borderBottom: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => setSelectedConsultation(consultation)}
              >
                <p style={{ fontWeight: "bold", color: "gray" }}>{displayDate}</p>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Image src={icone} alt="Logo" className="w-8 h-8" />
                    <div style={{ marginLeft: 16 }}>
                      <p>...</p>
                      <p style={{ fontSize: "0.8rem" }}>consultation</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      {consultation.prix} FCFA
                    </p>
                    <p style={{ fontSize: "0.8rem", textAlign: "right" }}>
                      {consultation.heure}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal pour afficher les détails d'une consultation */}
      {selectedConsultation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedConsultation(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedConsultation(null)}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <h2 style={{ marginTop: 0 }}>Détails de la consultation</h2>
            <p style={{ fontWeight: "bold", color: "gray" }}>
              {formatDate(selectedConsultation.date)} - {selectedConsultation.heure}
            </p>
            <p>
              <strong>Nom :</strong> {selectedConsultation.nomPatient}{" "}
              {selectedConsultation.prenomPatient}
            </p>
            <p>
              <strong>Type :</strong> {selectedConsultation.typeConsultation}
            </p>
            <p>
              <strong>Prix :</strong> {selectedConsultation.prix} FCFA
            </p>

            {/* Option d'annulation du rendez-vous */}
            {selectedConsultation.etat !== "canceled" ? (
              <button
                onClick={handleCancelConsultation}
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "16px",
                }}
              >
                Annuler le rendez-vous
              </button>
            ) : (
              <p style={{ color: "red", fontWeight: "bold", marginTop: "16px" }}>
                Rendez-vous annulé
              </p>
            )}

            <div style={{ marginTop: "16px" }}>
              <h3>Visualisation du reçu</h3>
              <a href={selectedConsultation.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                <iframe
                  src={selectedConsultation.pdfUrl}
                  style={{ width: "100%", height: "400px", border: "none" }}
                  title="Visualisation du reçu"
                ></iframe>
              </a>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
