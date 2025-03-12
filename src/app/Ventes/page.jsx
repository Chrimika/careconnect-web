"use client";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Ventes from "../models/Ventes"; // Importation de la classe Ventes
import Loader from "../components/LoaderPapers"; // Importation du composant Loader

const VentesPage = () => {
    const [ventes, setVentes] = useState([]);
    const [totalRevenu, setTotalRevenu] = useState(0);
    const [auteurId, setAuteurId] = useState(null);
    const [loading, setLoading] = useState(false); // État pour gérer le loader

    useEffect(() => {
        const storedId = localStorage.getItem("id");
        if (storedId) {
            setAuteurId(storedId);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!auteurId) return;

            // Vérifier si les données sont déjà présentes dans le localStorage
            const storedVentes = localStorage.getItem(`ventes_${auteurId}`);
            const storedTotalRevenu = localStorage.getItem(`totalRevenu_${auteurId}`);
            const lastFetchTime = localStorage.getItem(`lastFetchTime_${auteurId}`);

            const currentTime = new Date().getTime();

            // Si les données existent et sont récentes (par exemple, moins de 10 minutes)
            if (storedVentes && storedTotalRevenu && lastFetchTime && (currentTime - lastFetchTime < 600000)) {
                // Utiliser les données stockées
                setVentes(JSON.parse(storedVentes));
                setTotalRevenu(parseFloat(storedTotalRevenu));
                setLoading(false); // Masquer le loader
            } else {
                setLoading(true); // Afficher le loader pendant la récupération des données
                try {
                    const data = await Ventes.ventes_auteur(auteurId);
                    
                    // Assure-toi que data.ventes est bien un tableau avant de le stocker
                    setVentes(Array.isArray(data.ventes) ? data.ventes : []);
                    
                    // Calcul du chiffre d'affaires total
                    const total = Array.isArray(data.ventes) 
                        ? data.ventes.reduce((sum, vente) => sum + (vente.nbr_times * vente.price), 0) 
                        : 0;
                    setTotalRevenu(total);

                    // Stocker les données dans le localStorage
                    localStorage.setItem(`ventes_${auteurId}`, JSON.stringify(data.ventes));
                    localStorage.setItem(`totalRevenu_${auteurId}`, total.toString());
                    localStorage.setItem(`lastFetchTime_${auteurId}`, currentTime.toString());

                } catch (error) {
                    console.error("Erreur lors de la récupération des ventes :", error);
                    setVentes([]);
                    setTotalRevenu(0);
                } finally {
                    setLoading(false); // Masquer le loader une fois les données récupérées ou en cas d'erreur
                }
            }
        };
        fetchData();
    }, [auteurId]);

    return (
        <div style={{ margin: 0, flex: 1, padding: '48px 16px', flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ height: '100%', overflowY: "scroll" }}>
                <style>
                    {`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <Header title="Ventes" subTitle="Gardez un œil sur vos revenus et vos ventes en temps réel :" />
                
                {/* Afficher le loader si loading est true */}
                {loading && <Loader />}

                {/* Affichage du chiffre d'affaires total */}
                <h2 style={{ fontSize: '32px', margin: '20px 0', textAlign: 'center' }}>{totalRevenu.toLocaleString()} FCFA</h2>
                
                {/* Liste des ventes */}
                <div style={{ width: '100%'}}>
                    {ventes.map((vente, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <img src={vente.cover_img} alt={vente.title} style={{ width: '42px', height: '60px', marginRight: '12px' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>X{vente.nbr_times}</p>
                                <p style={{ fontSize: '14px', color: '#555' }}>{vente.title}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#00A8FF' }}>{vente.price} XAF</p>
                                <p style={{ fontSize: '12px', color: '#777' }}>
                                    {vente.time?.seconds ? new Date(vente.time.seconds * 1000).toLocaleTimeString() : "Heure inconnue"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer active={"coin"} />
        </div>
    );
};

export default VentesPage;