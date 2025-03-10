"use client";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Livre from "../models/Livre";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Livres = () => {
    const [livres, setLivres] = useState([]);
    const [auteurId, setAuteurId] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const id = localStorage.getItem("id");
        setAuteurId(id);
    }, []);

    useEffect(() => {
        const fetchLivres = async () => {
            if (auteurId) {
                const storedLivres = localStorage.getItem(`livres-${auteurId}`);
                
                if (storedLivres) {
                    setLivres(JSON.parse(storedLivres));
                } else {
                    const fetchedLivres = await Livre.getLivresByAuteur(auteurId);
                    setLivres(fetchedLivres);
                    localStorage.setItem(`livres-${auteurId}`, JSON.stringify(fetchedLivres));
                }
            }
        };
        fetchLivres();
    }, [auteurId]);

    // Fonction pour obtenir la couleur et le texte du statut
    const getStatus = (verdict) => {
        switch (verdict) {
            case "accepted":
                return { text: "En ligne", color: "#0cc0DF" }; // Bleu
            case "loading":
                return { text: "En cours", color: "green" }; // Vert
            case "rejected":
                return { text: "Rejeté", color: "red" }; // Rouge
            default:
                return { text: "Inconnu", color: "gray" }; // Par défaut (gris)
        }
    };

    return (
        <div style={{
            margin: 0,
            flex: 1,
            padding: "48px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%"
        }}>
            <div style={{ width: "100%", height: "100%", overflowY: "scroll" }}>
                <Header 
                    title='Livres' 
                    subTitle='Créez. Gérez. Publiez. Publiez un nouvel ouvrage en cliquant sur Créer. Ou gérez vos œuvres existantes depuis votre bibliothèque ci-dessous.'
                />

                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 20 }}>
                    <p style={{ flex: 0.7 }}>Offrez aux lecteurs leur format préféré : publiez votre ebook dès aujourd’hui !</p>
                    <button onClick={() => router.push("../CreationLivre")} 
                        style={{
                            flex: 0.3, height: 51, width: 160, display: 'flex', 
                            flexDirection: 'row', alignItems: 'center', backgroundColor: '#0cc0DF', 
                            padding: 15, borderRadius: 15, justifyContent: 'center'
                        }}>
                        <Plus style={{ fontSize: 14, color: '#fff', cursor: 'pointer' }} />
                        <p style={{ fontSize: 20, color: '#fff' }}>Créer</p>
                    </button>
                </div>
                
                <div style={{ width: "100%", padding: "16px 0" }}>
                    <style>
                        {`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}
                    </style>
                    {livres.length > 0 ? (
                        livres.map((livre, index) => {
                            const { text, color } = getStatus(livre.verdict);
                            return (
                                <div key={index} style={{ display: 'flex', marginBottom: '16px' }}>
                                    <img src={livre.coverUrl || '/default-cover.jpg'} alt={livre.name} 
                                        style={{ width: '62px', height: '80px', marginRight: '12px' }} 
                                    />
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                            fontSize: '12px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: '200px'
                                        }}>
                                            {livre.name}
                                        </p>
                                        <div style={{
                                            color: color, fontSize: 12, display: 'flex', 
                                            flexDirection: 'row', alignItems: 'center', marginTop: 'auto'
                                        }}>
                                            <p style={{
                                                height: 8, width: 8, backgroundColor: color, 
                                                borderRadius: 4, marginRight: 4
                                            }}></p>
                                            <p>{text}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                                        <p style={{ fontSize: 32, color: '#000', marginRight: '8px' }}>
                                            {livre.price} <span style={{ color: 'gray', fontSize: 10, marginLeft: -6 }}>XAF</span>
                                        </p>
                                        <p style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                            <Pencil size={20} style={{ color: 'green', cursor: 'pointer', marginRight: '8px' }} />
                                            <Trash2 size={20} style={{ color: '#d9534f', cursor: 'pointer' }} />
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Aucun livre trouvé.</p>
                    )}
                </div>
            </div>
            <Footer active={"book"} />
        </div>
    );
};

export default Livres;
