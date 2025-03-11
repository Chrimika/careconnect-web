"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Image from "next/image";
import deposite from "../assets/images/deposit.png";
import withdrawal from "../assets/images/withdrawal.png";
import depositeBig from "../assets/images/depositBig.png";
import Paiements from "../models/Paiements"; // Importez la classe Paiements

const Payment = () => {
  const [auteurId, setAuteurId] = useState(null); // ID de l'auteur
  const [solde, setSolde] = useState(0); // Solde de l'auteur
  const [seuil, setSeuil] = useState(0); // Seuil de paiement
  const [orangeMoneyNumber, setOrangeMoneyNumber] = useState(null); // Numéro Orange Money
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState(null); // Numéro Mobile Money
  const [transactions, setTransactions] = useState([]); // Transactions de l'auteur
  const [showModal, setShowModal] = useState(false); // Modal pour les numéros de paiement
  const [newOrangeMoneyNumber, setNewOrangeMoneyNumber] = useState(""); // Nouveau numéro Orange Money
  const [newMobileMoneyNumber, setNewMobileMoneyNumber] = useState(""); // Nouveau numéro Mobile Money
  const [showRetraitModal, setShowRetraitModal] = useState(false); // Modal pour le retrait
  const [montantRetrait, setMontantRetrait] = useState(0); // Montant du retrait

  // Récupérer l'ID de l'auteur depuis le localStorage
  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setAuteurId(id);
    }
  }, []);

  // Charger les données de l'auteur (solde, seuil, transactions, numéros de paiement)
  useEffect(() => {
    if (auteurId) {
      const fetchData = async () => {
        try {
          // Récupérer le solde
          const solde = await Paiements.getSolde(auteurId);
          setSolde(solde);

          // Récupérer le seuil
          const seuil = await Paiements.getSeuil();
          setSeuil(seuil);

          // Récupérer les transactions
          const transactions = await Paiements.transactions_auteur(auteurId);
          setTransactions(transactions);

          // Récupérer les numéros de paiement
          const orangeMoneyNumber = await Paiements.getOrangeMoneyNumber(auteurId);
          setOrangeMoneyNumber(orangeMoneyNumber);

          const mobileMoneyNumber = await Paiements.getMobileMoneyNumber(auteurId);
          setMobileMoneyNumber(mobileMoneyNumber);
        } catch (error) {
          console.error("Erreur lors du chargement des données :", error);
        }
      };

      fetchData();
    }
  }, [auteurId]);

  // Calculer la progression en fonction du solde et du seuil
  const progress = seuil > 0 ? (solde / seuil) * 100 : 0;

  // Gérer le clic sur le bouton "Retirer"
  const handleRetirer = async () => {
    if (solde >= seuil && (orangeMoneyNumber || mobileMoneyNumber)) {
      setShowRetraitModal(true); // Afficher la modal pour saisir le montant
    } else {
      alert("Le seuil n'est pas atteint ou les numéros de paiement ne sont pas renseignés.");
    }
  };

  // Confirmer le retrait
  const confirmRetrait = async () => {
    if (montantRetrait <= 0 || montantRetrait > solde) {
      alert("Montant invalide. Veuillez saisir un montant valide.");
      return;
    }

    try {
      // Créer le retrait
      await Paiements.creerRetrait(auteurId, montantRetrait);

      // Mettre à jour le solde localement
      const newSolde = solde - montantRetrait;
      setSolde(newSolde);

      // Mettre à jour le solde dans Firestore
      await Paiements.setSolde(auteurId, newSolde);

      // Recharger les transactions
      const updatedTransactions = await Paiements.transactions_auteur(auteurId);
      setTransactions(updatedTransactions);

      // Fermer la modal
      setShowRetraitModal(false);
      alert("Retrait effectué avec succès !");
    } catch (error) {
      console.error("Erreur lors du retrait :", error);
      alert("Une erreur est survenue lors du retrait.");
    }
  };

  // Gérer la soumission de la modal pour mettre à jour les numéros de paiement
  const handleUpdatePaymentNumbers = async () => {
    try {
      if (newOrangeMoneyNumber) {
        await Paiements.setOrangeMoneyNumber(auteurId, newOrangeMoneyNumber);
        setOrangeMoneyNumber(newOrangeMoneyNumber);
      }
      if (newMobileMoneyNumber) {
        await Paiements.setMobileMoneyNumber(auteurId, newMobileMoneyNumber);
        setMobileMoneyNumber(newMobileMoneyNumber);
      }
      setShowModal(false);
      alert("Numéros de paiement mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des numéros de paiement :", error);
    }
  };

  return (
    <div style={{ margin: "0 auto", padding: "0 16px", flex: 1, height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <style>
        {`
          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div style={{ flex: 0.8, overflowY: "scroll" }}>
        <Header title="Paiements" subTitle="" />
        <div style={{ flex: 0.4, width: "100%", height: 180, backgroundColor: "#f9f9f9", borderRadius: 15, marginTop: 32, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p style={{ fontSize: 14 }}>Vos revenus</p>
            <p style={{ fontSize: 24, fontWeight: "lighter" }}>{solde.toLocaleString()} <span style={{ fontSize: 15 }}>XAF</span></p>
          </div>
          <div
            style={{
              height: "8px",
              backgroundColor: "#E0E0E0",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              margin: "0 32px",
            }}
          >
            <div
              style={{
                width: `${progress}%`, // Barre dynamique
                height: "8px",
                backgroundColor: "#0CC0DF",
                borderRadius: "4px",
              }}
            ></div>
          </div>

          <div style={{ flex: 1, width: "100%", display: "flex", justifyContent: "space-between", padding: "0 32px" }}>
            <p style={{ fontSize: 7 }}>Vous avez atteint {progress.toFixed(2)}% de votre seuil de paiement</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: 7 }}>Seuil de paiement: <span style={{ fontWeight: "bold", fontSize: 10, color: "#0CC0DF" }}>{seuil.toLocaleString()} XAF</span></p>
              <button
                style={{
                  width: 80,
                  height: 30,
                  backgroundColor: solde >= seuil && (orangeMoneyNumber || mobileMoneyNumber) ? "#0cc0dc" : "#ccc",
                  borderRadius: 15,
                  marginTop: 8,
                  marginLeft: "auto",
                  cursor: solde >= seuil && (orangeMoneyNumber || mobileMoneyNumber) ? "pointer" : "not-allowed",
                }}
                onClick={handleRetirer}
                disabled={!(solde >= seuil && (orangeMoneyNumber || mobileMoneyNumber))}
              >
                <p style={{ fontSize: 10, color: "#fff" }}>Retirer</p>
              </button>
            </div>
          </div>
        </div>

        <div style={{ flex: 0.6, width: "100%", height: 300, backgroundColor: "#f9f9f9", borderRadius: 15, marginTop: 32, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 0.5, width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px" }}>
            <p style={{ fontSize: 16 }}>Transactions</p>
          </div>
          <div style={{ flex: 2, width: "100%", height: 200, overflowY: "scroll", padding: "0 32px" }}>
            <div style={{ width: "100%" }}>
              {transactions.map((transaction, index) => (
                <div key={index} style={{ marginTop: 8, display: "flex", justifyContent: "space-between", width: "100%", borderBottomWidth: 1, borderBottomColor: "lightgray", padding: "6px 0" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Image
                      src={transaction.type == "retrait" ? withdrawal : deposite}
                      alt="transaction"
                      width={40}
                      height={10}
                    />
                    <div style={{ marginLeft: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: "bold", color: "#0cc0cd" }}>{"Transaction"}</p>
                      <p style={{ fontSize: 9 }}>{transaction.type == "retrait" ? "Retrait d'argent" : "Dépôt d'argent"}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ color: transaction.type == "retrait" ? "red" : "lightgreen", fontWeight: "bold" }}>
                      {transaction.type == "retrait" ? "-" : "+"}{transaction.montant || transaction.prix} FCFA
                    </p>
                    <p style={{ fontSize: 14, marginLeft: "auto" }}>{new Date(transaction.date?.toDate()).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 0.3, width: "100%", height: 150, backgroundColor: "#f9f9f9", borderRadius: 15, marginTop: 32, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", justifyContent: "space-between", padding: "16px 16px" }}>
            <Image
              src={depositeBig}
              alt="deposite"
              style={{ width: 60, height: 60 }}
            />
            <div>
              <p style={{ fontWeight: "bold" }}>MTN MOMO</p>
              <p>{mobileMoneyNumber || "----------"}</p>
            </div>
            <div>
              <p style={{ fontWeight: "bold" }}>Orange Money</p>
              <p>{orangeMoneyNumber || "----------"}</p>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex" }}>
            <button
              style={{ width: 80, height: 30, backgroundColor: "#0cc0dc", borderRadius: 15, marginTop: 8, margin: "0 auto" }}
              onClick={() => setShowModal(true)}
            >
              <p style={{ fontSize: 10, color: "#fff" }}>Paramétrer</p>
            </button>
          </div>
        </div>
      </div>
      <Footer active={"wallet"} />

      {/* Modal pour mettre à jour les numéros de paiement */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 300 }}>
            <h2>Mettre à jour les numéros de paiement</h2>
            <input
              type="text"
              placeholder="Nouveau numéro Orange Money"
              value={newOrangeMoneyNumber}
              onChange={(e) => setNewOrangeMoneyNumber(e.target.value)}
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <input
              type="text"
              placeholder="Nouveau numéro Mobile Money"
              value={newMobileMoneyNumber}
              onChange={(e) => setNewMobileMoneyNumber(e.target.value)}
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <button
              style={{ width: "100%", padding: 10, backgroundColor: "#0cc0dc", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}
              onClick={handleUpdatePaymentNumbers}
            >
              Enregistrer
            </button>
            <button
              style={{ width: "100%", padding: 10, backgroundColor: "#ccc", color: "#000", border: "none", borderRadius: 5, cursor: "pointer", marginTop: 10 }}
              onClick={() => setShowModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Modal pour le retrait */}
      {showRetraitModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: 300 }}>
            <h2>Montant du retrait</h2>
            <input
              type="number"
              placeholder="Montant à retirer"
              value={montantRetrait}
              onChange={(e) => setMontantRetrait(parseFloat(e.target.value))}
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <button
              style={{ width: "100%", padding: 10, backgroundColor: "#0cc0dc", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}
              onClick={confirmRetrait}
            >
              Confirmer
            </button>
            <button
              style={{ width: "100%", padding: 10, backgroundColor: "#ccc", color: "#000", border: "none", borderRadius: 5, cursor: "pointer", marginTop: 10 }}
              onClick={() => setShowRetraitModal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;