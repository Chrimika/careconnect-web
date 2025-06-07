"use client";
import React, { useEffect, useState } from "react";
import Livre from "../../models/Livre";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../../components/Loader";

interface LivreType {
  id: string;
  name: string;
  price: number;
  small_summary?: string;
  summary?: string;
  genre?: string;
  coverUrl?: string;
  verdict?: string;
  // Ajoute ici tous les champs nécessaires
}

const EditLivre = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const livreId = searchParams.get("id");
    const [livre, setLivre] = useState<LivreType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLivre = async () => {
            const livres = await Livre.getLivresByAuteur(localStorage.getItem("id"));
            const found = livres.find((l: LivreType) => l.id === livreId) || null;
            setLivre(found);
            setLoading(false);
        };
        fetchLivre();
    }, [livreId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!livre || typeof livre !== "object") return;
        setLivre({ ...livre, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!livre) return;
        const updatedLivre = { ...livre, verdict: "loading" };
        const res = await Livre.updateLivre(livreId, updatedLivre);
        alert(`${res}\nLivre modifié avec succès. Il sera revalidé sous 24H, veuillez patienter.`);
        router.push("/Livres");
    };

    if (loading) return <Loader />;
    if (!livre) return <div>Livre introuvable.</div>;

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>Modifier le livre</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Titre</label>
                    <input
                        name="name"
                        value={livre.name}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Prix</label>
                    <input
                        name="price"
                        type="number"
                        value={livre.price}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Résumé court</label>
                    <textarea
                        name="small_summary"
                        value={livre.small_summary || ""}
                        onChange={handleChange}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        background: "#0cc0DF",
                        color: "#fff",
                        padding: "10px 24px",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 16,
                        cursor: "pointer",
                        marginTop: 8
                    }}
                >
                    Enregistrer
                </button>
            </form>
        </div>
    );
};

export default EditLivre;